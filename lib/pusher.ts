// lib/pusher.ts
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Extend the Window interface to include Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

// Attach Pusher to window for Echo in browser
if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

// Custom authorizer for Pusher to send JSON and Bearer token
function pusherCustomAuthorizer(token: string) {
  return (channel: any, options: any) => {
    return {
      authorize: (socketId: string, callback: Function) => {
        const body = {
          socket_id: socketId,
          channel_name: channel.name,
        };
        console.log("[Pusher Authorizer] Token:", token);
        console.log("[Pusher Authorizer] Request Body:", body);
        console.log("[Pusher Authorizer] Auth Endpoint:", options.authEndpoint);
        fetch(options.authEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        })
          .then(async (response) => {
            const text = await response.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              data = text;
            }
            console.log("[Pusher Authorizer] Response Status:", response.status);
            console.log("[Pusher Authorizer] Response Data:", data);
            if (response.ok) {
              callback(false, data);
            } else {
              callback(true, data);
            }
          })
          .catch((err) => {
            console.error("[Pusher Authorizer] Fetch Error:", err);
            callback(true, err);
          });
      },
    };
  };
}

/**
 * Returns a configured Laravel Echo instance for Pusher or Reverb (Socket.io).
 * Reads config from environment variables.
 */
export function createEcho() {
  // Get the token from localStorage
  const getAuthHeaders = (): Record<string, string> => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
  };
  const useReverb = process.env.NEXT_PUBLIC_PUSHER_DRIVER === "reverb";
  if (useReverb) {
    // Laravel Reverb (Socket.io)
    return new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT) || 443,
      wssPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT) || 443,
      forceTLS: process.env.NEXT_PUBLIC_PUSHER_SCHEME === "https",
      enabledTransports: ["ws", "wss"],
      authEndpoint: process.env.NEXT_PUBLIC_PUSHER_AUTH_ENDPOINT,
      auth: {
        headers: getAuthHeaders(),
      },
    });
  } else {
    // Pusher Cloud: do NOT set wsHost/wsPort/wssPort
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    return new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      forceTLS: process.env.NEXT_PUBLIC_PUSHER_SCHEME === "https",
      encrypted: true,
      enabledTransports: ["ws", "wss"],
      authEndpoint: process.env.NEXT_PUBLIC_PUSHER_AUTH_ENDPOINT,
      auth: {
        headers: getAuthHeaders(),
      },
      authorizer: pusherCustomAuthorizer(token),
    });
  }
}

/**
 * Example usage:
 *
 * import { createEcho } from '@/lib/pusher';
 * const echo = createEcho();
 * echo.channel('chat').listen('MessageSent', (e) => { ... });
 */