"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface MarkTaskDoneButtonProps {
  taskId: string;
  repoId: string;
}

export function MarkTaskDoneButton({
  taskId,
  repoId,
}: MarkTaskDoneButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkDone = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionNotes: "" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to mark task as done");
      }

      const data = await response.json();

      // Show success and redirect
      router.push(
        `/repo/${repoId}?completed=true&streak=${data.streak}&tasksToday=${data.completedToday}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-3">
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
        <Button
          onClick={handleMarkDone}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
        >
          {loading ? "Saving..." : "✓ Try Again"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleMarkDone}
      disabled={loading}
      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg py-6 font-semibold transition"
    >
      {loading ? "Saving..." : "✓ Mark Done"}
    </Button>
  );
}
