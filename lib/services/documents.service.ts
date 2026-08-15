import { apiClient } from './api-client';

export interface UserDoc {
  id: string;
  document_type: string;
  original_name: string | null;
  mime_type: string | null;
  file_size: number;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  file_url?: string;
  created_at: string;
}

const DocumentsService = {
  async getMyDocuments(): Promise<UserDoc[]> {
    const res = await apiClient.get<UserDoc[]>('/documents');
    return res.data ?? [];
  },

  async uploadDocument(file: File, documentType: string): Promise<UserDoc> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_type', documentType);

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/cab-safars/backend/api';
    const res = await fetch(`${BASE_URL}/upload/document`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Upload failed');
    return json.data as UserDoc;
  },

  async deleteDocument(uuid: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/cab-safars/backend/api';
    const res = await fetch(`${BASE_URL}/documents/${uuid}`, { method: 'DELETE', headers });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Delete failed');
  },
};

export default DocumentsService;
