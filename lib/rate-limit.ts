/**
 * In-memory rate limiter for v1
 * Stores request counts by key with expiring windows
 * In production, use Upstash Redis for distributed rate limiting
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of Object.entries(store)) {
    if (value.resetAt < now) {
      delete store[key];
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
}

/**
 * Rate limit by key (e.g., userId, IP)
 * Returns { success, remaining, retryAfter }
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { success: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const entry = store[key];

  // New key or window expired
  if (!entry || entry.resetAt < now) {
    store[key] = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    return { success: true, remaining: config.max - 1 };
  }

  // Still within window
  if (entry.count < config.max) {
    entry.count++;
    return {
      success: true,
      remaining: config.max - entry.count,
    };
  }

  // Rate limit exceeded
  return {
    success: false,
    remaining: 0,
    retryAfter: Math.ceil((entry.resetAt - now) / 1000),
  };
}

/**
 * Common rate limit configs
 */
export const RATE_LIMITS = {
  // Roadmap generation: 3 per hour per user
  ROADMAP_GEN: {
    windowMs: 60 * 60 * 1000,
    max: 3,
  },
  // Checkin: 10 per day per user
  CHECKIN: {
    windowMs: 24 * 60 * 60 * 1000,
    max: 10,
  },
  // Generic API: 60 per minute per IP
  API_GENERAL: {
    windowMs: 60 * 1000,
    max: 60,
  },
  // Auth: 5 attempts per 15 minutes per IP
  AUTH: {
    windowMs: 15 * 60 * 1000,
    max: 5,
  },
};
