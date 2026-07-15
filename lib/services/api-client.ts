const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/cab-safars/backend/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    if (data.success && data.data?.access_token) {
      setTokens(data.data.access_token, data.data.refresh_token);
      return data.data.access_token;
    }
  } catch {
    // ignore
  }

  clearTokens();
  return null;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  retried = false
): Promise<ApiResponse<T>> {
  const token   = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Auto-refresh on 401
  if (res.status === 401 && !retried) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(method, path, body, true);
    }
    // Redirect to login if on client
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  const json: ApiResponse<T> = await res.json().catch(() => ({
    success: false,
    message: 'Invalid server response',
  }));

  if (!res.ok) {
    throw new ApiError(res.status, json.message || 'Request failed', json.errors);
  }

  return json;
}

export const apiClient = {
  get:    <T>(path: string)                      => request<T>('GET', path),
  post:   <T>(path: string, body?: unknown)      => request<T>('POST', path, body),
  put:    <T>(path: string, body?: unknown)      => request<T>('PUT', path, body),
  delete: <T>(path: string)                      => request<T>('DELETE', path),
};

export { ApiError };
