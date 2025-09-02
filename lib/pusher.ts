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

/**
 * Returns a configured Laravel Echo instance for Pusher or Reverb (Socket.io).
 * Reads config from environment variables.
 */
export function createEcho() {
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
    });
  } else {
    // Pusher
    return new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      forceTLS: process.env.NEXT_PUBLIC_PUSHER_SCHEME === "https",
      encrypted: true,
      wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT) || 443,
      wssPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT) || 443,
      enabledTransports: ["ws", "wss"],
      authEndpoint: process.env.NEXT_PUBLIC_PUSHER_AUTH_ENDPOINT,
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