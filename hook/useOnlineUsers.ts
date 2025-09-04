import { useEffect, useState } from "react";
import { createEcho } from "@/lib/pusher";

interface OnlineUser {
  id: number;
}

export function useOnlineUsers() {
  const [onlineCount, setOnlineCount] = useState(0);
  const [members, setMembers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    const echo = createEcho();
    console.log("[OnlineUsers] Joining channel: online-users");
    try {
      echo
        .join("online-users")
        .here((users: OnlineUser[]) => {
          console.log("[OnlineUsers] .here users:", users);
          setOnlineCount(users.length);
          setMembers(users);
        })
        .joining((user: OnlineUser) => {
          console.log("[OnlineUsers] .joining user:", user);
          setOnlineCount((count) => count + 1);
          setMembers((prev) => [...prev, user]);
        })
        .leaving((user: OnlineUser) => {
          console.log("[OnlineUsers] .leaving user:", user);
          setOnlineCount((count) => Math.max(count - 1, 0));
          setMembers((prev) => prev.filter((m) => m.id !== user.id));
        });
    } catch (err) {
      console.error("[OnlineUsers] Error joining channel:", err);
    }

    return () => {
      console.log("[OnlineUsers] Leaving channel: online-users");
      echo.leave("online-users");
    };
  }, []);

  return { onlineCount, members };
}