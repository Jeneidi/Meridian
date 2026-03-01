"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function StripePortalButton() {
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to open billing portal");
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePortal}
      disabled={loading}
      className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition"
    >
      {loading ? (
        <>
          <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        "Manage Subscription"
      )}
    </button>
  );
}
