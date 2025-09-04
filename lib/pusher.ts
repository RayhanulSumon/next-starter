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
  return (channel: { name: string }, options: { authEndpoint: string }) => {
    return {
      authorize: (
        socketId: string,
        callback: (
          error: Error | null,
          authData: { auth: string; channel_data?: string } | null
        ) => void
      ) => {
        const body = {
          socket_id: socketId,
          channel_name: channel.name,
        };
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
            let data: { auth: string; channel_data?: string } | null = null;
            try {
              const parsed = JSON.parse(text);
              if (parsed && typeof parsed.auth === "string") {
                data = parsed as { auth: string; channel_data?: string };
              }
            } catch {
              data = null;
            }
            if (response.ok && data) {
              callback(null, data);
            } else {
              callback(new Error(`Authentication failed: ${response.status}`), null);
            }
          })
          .catch((err) => {
            callback(err instanceof Error ? err : new Error(String(err)), null);
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
    const echoConfig: {
      broadcaster: "socket.io";
      wsHost: string | undefined;
      wsPort: number;
      wssPort: number;
      forceTLS: boolean;
      enabledTransports: string[];
      authEndpoint: string | undefined;
      auth: { headers: Record<string, string> };
    } = {
      broadcaster: "socket.io",
      wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT) || 443,
      wssPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT) || 443,
      forceTLS: process.env.NEXT_PUBLIC_PUSHER_SCHEME === "https",
      enabledTransports: ["ws", "wss"],
      authEndpoint: process.env.NEXT_PUBLIC_PUSHER_AUTH_ENDPOINT,
      auth: {
        headers: getAuthHeaders(),
      },
    };
    return new Echo(echoConfig);
  } else {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const echoConfig: {
      broadcaster: "pusher";
      key: string | undefined;
      cluster: string | undefined;
      forceTLS: boolean;
      encrypted: boolean;
      authEndpoint: string | undefined;
      auth: { headers: Record<string, string> };
      authorizer: ReturnType<typeof pusherCustomAuthorizer>;
    } = {
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      forceTLS: process.env.NEXT_PUBLIC_PUSHER_SCHEME === "https",
      encrypted: true,
      authEndpoint: process.env.NEXT_PUBLIC_PUSHER_AUTH_ENDPOINT,
      auth: {
        headers: getAuthHeaders(),
      },
      authorizer: pusherCustomAuthorizer(token),
    };
    return new Echo(echoConfig);
  }
}

/**
 * Example usage:
 *
 * import { createEcho } from '@/lib/pusher';
 * const echo = createEcho();
 * echo.channel('chat').listen('MessageSent', (e) => { ... });
 */