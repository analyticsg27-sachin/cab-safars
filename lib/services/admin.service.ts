import { adminApiClient, setAdminTokens, clearAdminTokens } from './admin-api-client';

export interface AdminUser {
  id: number;
  uuid: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

export interface UserDocument {
  id: string;
  document_type: string;
  original_name: string | null;
  mime_type: string | null;
  file_size: number;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
  file_url?: string;
}

export interface PendingRegistration {
  id: string;
  uuid: string;
  role: 'vendor' | 'driver';
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  status: string;
  doc_status?: 'none' | 'pending' | 'partial' | 'approved' | 'rejected';
  company_name?: string;
  vehicle_type?: string;
  vehicle_number?: string;
  rejection_reason?: string;
  created_at: string;
}

const AdminService = {
  async login(username: string, password: string) {
    const res = await adminApiClient.post<{ access_token: string; refresh_token: string; admin: AdminUser }>(
      '/admin/auth/login',
      { username, password }
    );
    if (res.data) {
      setAdminTokens(res.data.access_token, res.data.refresh_token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.admin));
    }
    return res.data!;
  },

  async logout() {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('admin_refresh_token') : null;
    try { await adminApiClient.post('/admin/auth/logout', { refresh_token: refreshToken }); } catch {}
    clearAdminTokens();
    localStorage.removeItem('admin_user');
  },

  async me(): Promise<AdminUser> {
    const res = await adminApiClient.get<AdminUser>('/admin/auth/me');
    return res.data!;
  },

  async getDashboard() {
    return adminApiClient.get('/admin/dashboard');
  },

  async getUsers(params?: { role?: string; status?: string; search?: string; page?: number }) {
    const q = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
    const res = await adminApiClient.get<{ items: AdminUser[]; pagination: { total: number; total_pages: number } }>(`/admin/users?${q}`);
    return { data: res.data?.items ?? [], pagination: res.data?.pagination };
  },

  async approveUser(uuid: string) {
    return adminApiClient.post(`/admin/users/${uuid}/approve`);
  },

  async rejectUser(uuid: string, reason: string) {
    return adminApiClient.post(`/admin/users/${uuid}/reject`, { reason });
  },

  async directApproveUser(uuid: string, reason: string) {
    return adminApiClient.post(`/admin/users/${uuid}/direct-approve`, { reason });
  },

  async suspendUser(uuid: string, reason?: string) {
    return adminApiClient.post(`/admin/users/${uuid}/suspend`, { reason });
  },

  async unsuspendUser(uuid: string) {
    return adminApiClient.post(`/admin/users/${uuid}/unsuspend`);
  },

  async getUserDocuments(uuid: string) {
    const res = await adminApiClient.get<UserDocument[]>(`/admin/users/${uuid}/documents`);
    return res.data ?? [];
  },

  async approveDocument(docId: string) {
    return adminApiClient.post(`/admin/documents/${docId}/approve`);
  },

  async rejectDocument(docId: string, reason: string) {
    return adminApiClient.post(`/admin/documents/${docId}/reject`, { reason });
  },

  async getUsersWithDocuments(params?: { doc_status?: string; search?: string; page?: number }) {
    const q = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
    const res = await adminApiClient.get<{ items: PendingRegistration[]; pagination: { total: number; total_pages: number } }>(`/admin/users/documents?${q}`);
    return { data: res.data?.items ?? [], pagination: res.data?.pagination };
  },

  async getTrips(params?: { status?: string; search?: string; page?: number }) {
    const q = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
    const res = await adminApiClient.get<{ items: unknown[]; pagination: { total: number; total_pages: number } }>(`/admin/trips?${q}`);
    return { data: res.data?.items ?? [], pagination: res.data?.pagination };
  },

  async cancelTrip(uuid: string) {
    return adminApiClient.delete(`/admin/trips/${uuid}`);
  },

  async getPayments(params?: { status?: string; page?: number }) {
    const q = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
    const res = await adminApiClient.get<{ items: unknown[]; pagination: { total: number; total_pages: number } }>(`/admin/payments?${q}`);
    return { data: res.data?.items ?? [], pagination: res.data?.pagination };
  },

  async getPaymentsSummary() {
    return adminApiClient.get('/admin/payments/summary');
  },

  async getReports(from?: string, to?: string) {
    const q = new URLSearchParams();
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    return adminApiClient.get(`/admin/reports?${q}`);
  },
};

export default AdminService;
