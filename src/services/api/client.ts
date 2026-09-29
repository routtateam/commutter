// HTTP client for the Routta backend (REST under /api/v1).
//
// - `VITE_USE_MOCKS=true` makes every service use its in-memory mock
//   implementation; otherwise services call the real backend via `http()`.
// - Bearer token is read from the persisted Zustand auth store.
// - A 401 triggers one refresh-token round trip and a retry of the request;
//   if refresh fails the session is cleared (RequireAuth then routes to /welcome).
// - Errors are normalised to `ApiError` (status, code, message, details).
import { useAuthStore } from "@/store/authStore";

export const API_BASE_URL: string = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4100/api/v1"
).replace(/\/+$/, "");

export const USE_MOCKS: boolean = String(import.meta.env.VITE_USE_MOCKS ?? "").toLowerCase() === "true";

export function mockDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(message: string, status = 400, code = "BAD_REQUEST", details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  /** Skip bearer injection + refresh handling (login / OTP calls). */
  auth?: boolean;
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: { code?: string; message?: string; details?: unknown };
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v !== undefined) params.set(k, String(v));
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

async function rawFetch<T>(path: string, opts: RequestOptions, token: string | null): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, opts.query), {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach Routta. Check your connection and try again.", 0, "NETWORK_ERROR");
  }

  if (res.status === 204) return undefined as T;

  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    // non-JSON body
  }

  if (!res.ok || (json && json.success === false)) {
    const err = json?.error;
    throw new ApiError(
      err?.message ?? `Request failed (${res.status})`,
      res.status,
      err?.code ?? "HTTP_ERROR",
      err?.details
    );
  }
  return (json ? json.data : undefined) as T;
}

let refreshInFlight: Promise<string | null> | null = null;

/** Exchange the stored refresh token for a new pair. Single-flight. */
function refreshTokens(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const { refreshToken, setTokens, signOut } = useAuthStore.getState();
    if (!refreshToken) {
      signOut();
      return null;
    }
    try {
      const data = await rawFetch<{ token: string; refreshToken: string }>(
        "/auth/refresh",
        { method: "POST", body: { refreshToken } },
        null
      );
      setTokens(data.token, data.refreshToken);
      return data.token;
    } catch {
      signOut();
      return null;
    }
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

export async function http<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const useAuth = opts.auth !== false;
  const token = useAuth ? useAuthStore.getState().token : null;
  try {
    return await rawFetch<T>(path, opts, token);
  } catch (e) {
    if (useAuth && e instanceof ApiError && e.status === 401 && token) {
      const fresh = await refreshTokens();
      if (fresh) return rawFetch<T>(path, opts, fresh);
    }
    throw e;
  }
}

/** Kobo (backend minor units) to naira (frontend display units). */
export const fromKobo = (kobo: number | string | null | undefined): number => Number(kobo ?? 0) / 100;
/** Naira to kobo, integer. */
export const toKobo = (naira: number): number => Math.round(naira * 100);
