const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/cab-safars/backend/api';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_access_token');
}

export function setAdminTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem('admin_access_token', accessToken);
  localStorage.setItem('admin_refresh_token', refreshToken);
}

export function clearAdminTokens(): void {
  localStorage.removeItem('admin_access_token');
  localStorage.removeItem('admin_refresh_token');
}

function getAdminRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_refresh_token');
}

async function refreshAdminAccessToken(): Promise<string | null> {
  const refreshToken = getAdminRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/admin/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) { clearAdminTokens(); return null; }
    const data = await res.json();
    if (data.success && data.data?.access_token) {
      setAdminTokens(data.data.access_token, data.data.refresh_token);
      return data.data.access_token;
    }
  } catch { /* ignore */ }

  clearAdminTokens();
  return null;
}

async function adminRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  retried = false
): Promise<{ success: boolean; data?: T; message?: string; errors?: Record<string, string[]>; pagination?: { current_page: number; per_page: number; total: number; total_pages: number } }> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !retried) {
    const newToken = await refreshAdminAccessToken();
    if (newToken) return adminRequest<T>(method, path, body, true);
    clearAdminTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/cabsafars/admin/login';
    }
    throw new Error('Unauthorized');
  }

  const json = await res.json().catch(() => ({ success: false, message: 'Invalid server response' }));
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

export const adminApiClient = {
  get:    <T>(path: string)               => adminRequest<T>('GET', path),
  post:   <T>(path: string, body?: unknown) => adminRequest<T>('POST', path, body),
  put:    <T>(path: string, body?: unknown) => adminRequest<T>('PUT', path, body),
  delete: <T>(path: string)               => adminRequest<T>('DELETE', path),
};
