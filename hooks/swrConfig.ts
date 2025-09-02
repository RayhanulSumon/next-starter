import useSWR, { SWRConfiguration, SWRResponse } from "swr";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Default fetcher that prepends the API base URL if needed
export const defaultSWRFetcher = async <T = unknown>(endpoint: string): Promise<T> => {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.") as Error & {
      info?: unknown;
      status?: number;
    };
    try {
      error.info = (await res.clone().json()) as unknown;
    } catch {}
    error.status = res.status;
    throw error;
  }
  return res.json();
};

// Default SWR config
export const swrConfig: SWRConfiguration = {
  fetcher: defaultSWRFetcher,
  refreshInterval: 10000,
  revalidateOnFocus: false,
};

// Typed SWR hook that uses the default config
export function SWR<Data = unknown, Err = Error & { info?: unknown; status?: number }>(
  endpoint: string | null
): SWRResponse<Data, Err> {
  return useSWR<Data, Err>(endpoint, defaultSWRFetcher, swrConfig);
}