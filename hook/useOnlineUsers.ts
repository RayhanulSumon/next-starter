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
    try {
      echo
        .join("online-users")
        .here((users: OnlineUser[]) => {
          setOnlineCount(users.length);
          setMembers(users);
        })
        .joining((user: OnlineUser) => {
          setOnlineCount((count) => count + 1);
          setMembers((prev) => [...prev, user]);
        })
        .leaving((user: OnlineUser) => {
          setOnlineCount((count) => Math.max(count - 1, 0));
          setMembers((prev) => prev.filter((m) => m.id !== user.id));
        });
    } catch (err) {
      console.error("[OnlineUsers] Error joining channel:", err);
    }

    return () => {
      echo.leave("online-users");
    };
  }, []);

  return { onlineCount, members };
}