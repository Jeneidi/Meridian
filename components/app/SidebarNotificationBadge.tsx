"use client";

import { useEffect, useState } from "react";

export function SidebarNotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Fetch count on mount
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/invites/count");
        if (response.ok) {
          const data = await response.json();
          setCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      }
    };

    fetchCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, []);

  if (count === 0) {
    return null;
  }

  const displayCount = count > 9 ? "9+" : count;

  return (
    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
      {displayCount}
    </div>
  );
}
