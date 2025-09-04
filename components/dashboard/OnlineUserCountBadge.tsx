"use client";
import React, { useEffect, useRef, useState } from "react";
import { useOnlineUsers } from "@/hook/useOnlineUsers";

const ONLINE_POP_ANIMATION_ID = "online-pop-animation-style";

function injectOnlinePopAnimation() {
  if (typeof window !== "undefined") {
    if (!document.getElementById(ONLINE_POP_ANIMATION_ID)) {
      const style = document.createElement("style");
      style.id = ONLINE_POP_ANIMATION_ID;
      style.innerHTML = `
        @keyframes online-pop {
          0% { transform: scale(1); }
          20% { transform: scale(1.18); }
          40% { transform: scale(0.96); }
          60% { transform: scale(1.08); }
          80% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        .animate-online-pop {
          animation: online-pop 0.4s cubic-bezier(0.4,0,0.2,1);
        }
      `;
      document.head.appendChild(style);
    }
  }
}

export function OnlineUserCountBadge() {
  const { onlineCount } = useOnlineUsers();
  const [animate, setAnimate] = useState(false);
  const prevCount = useRef(onlineCount);

  useEffect(() => {
    injectOnlinePopAnimation();
  }, []);

  useEffect(() => {
    if (onlineCount > prevCount.current) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 400);
      return () => clearTimeout(timeout);
    }
    prevCount.current = onlineCount;
  }, [onlineCount]);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm transition-transform duration-300 dark:bg-green-500 dark:text-gray-900 ${animate ? "animate-online-pop" : ""}`}
      title="Online users"
      style={{ justifyContent: "center" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mr-1 h-3 w-3 text-white dark:text-gray-900"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        focusable="false"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2a2 2 0 012-2h4a2 2 0 012 2z"
        />
      </svg>
      <span>Online: {onlineCount}</span>
    </span>
  );
}