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
  // Legacy: kept for backward compatibility
  ROADMAP_GEN: {
    windowMs: 60 * 60 * 1000,
    max: 3,
  },
  CHECKIN: {
    windowMs: 24 * 60 * 60 * 1000,
    max: 10,
  },

  // Plan-aware roadmap limits
  ROADMAP_FREE: {
    windowMs: 30 * 24 * 60 * 60 * 1000, // 30 days
    max: 1,
  },
  ROADMAP_PRO: {
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: 3,
  },
  ROADMAP_PREMIUM: {
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: 10,
  },

  // Plan-aware checkin limits
  CHECKIN_FREE: {
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: 2,
  },
  CHECKIN_PRO: {
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: 5,
  },
  CHECKIN_PREMIUM: {
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: 10,
  },

  // Security audit limits
  AUDIT_PRO: {
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: 1,
  },
  AUDIT_PREMIUM: {
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: 5,
  },
  // FREE has no audit constant — deep audit is hard-blocked for FREE

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

/**
 * DEV ONLY: Reset a rate limit entry to allow retesting
 * Used for development and testing purposes only
 */
export function resetRateLimit(key: string): void {
  delete store[key];
}
