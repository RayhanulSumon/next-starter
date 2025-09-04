import { useEffect, useState } from "react";
import { createEcho } from "@/lib/pusher";

interface OnlineUser {
  id: string;
  info: Record<string, unknown>;
}

export function useOnlineUsers() {
  const [onlineCount, setOnlineCount] = useState(0);
  const [members, setMembers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    console.log("useOnlineUsers mounted");
    const echo = createEcho();
    console.log("Echo instance", echo);
    // Join the presence channel
    console.log("Joining presence channel");
    try {
      echo
        .join("online-users")
        .here((users: OnlineUser[]) => {
          console.log("HERE users:", users);
          setOnlineCount(users.length);
          setMembers(users);
        })
        .joining((user: OnlineUser) => {
          console.log("JOINING user:", user);
          setOnlineCount((count) => count + 1);
          setMembers((prev) => [...prev, user]);
        })
        .leaving((user: OnlineUser) => {
          console.log("LEAVING user:", user);
          setOnlineCount((count) => Math.max(count - 1, 0));
          setMembers((prev) => prev.filter((m) => m.id !== user.id));
        });
    } catch (err) {
      console.error("Error joining presence channel:", err);
    }

    return () => {
      echo.leave("presence-online-users");
    };
  }, []);

  return { onlineCount, members };
}