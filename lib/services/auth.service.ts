import { apiClient, setTokens, clearTokens } from './api-client';

export interface AuthUser {
  id: number;
  uuid: string;
  role: 'vendor' | 'driver';
  name: string;
  phone: string;
  email: string | null;
  city: string;
  state: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  is_premium: boolean;
  premium_expires_at: string | null;
  company_name?: string;
  vehicle_type?: string;
  profile_image?: string;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
  status: string;
}

export interface RegisterPayload {
  role: 'vendor' | 'driver';
  name: string;
  phone: string;
  password: string;
  city: string;
  state: string;
  email?: string;
  company_name?: string;
  vehicle_type?: string;
  vehicle_number?: string;
}

const AuthService = {
  async login(identifier: string, password: string): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>('/auth/login', { identifier, password });
    if (res.data) {
      setTokens(res.data.access_token, res.data.refresh_token);
    }
    return res.data!;
  },

  async register(payload: RegisterPayload): Promise<{ status: string; message: string }> {
    const res = await apiClient.post<{ status: string; message: string }>('/auth/register', payload);
    return res.data!;
  },

  async logout(): Promise<void> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    try {
      await apiClient.post('/auth/logout', { refresh_token: refreshToken });
    } catch {
      // ignore
    } finally {
      clearTokens();
    }
  },

  async me(): Promise<AuthUser> {
    const res = await apiClient.post<AuthUser>('/auth/me');
    return res.data!;
  },

  async changePassword(currentPassword: string, password: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      current_password: currentPassword,
      password,
      password_confirmation: password,
    });
    clearTokens();
  },
};

export default AuthService;
