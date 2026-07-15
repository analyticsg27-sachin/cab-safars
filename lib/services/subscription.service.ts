import { apiClient } from './api-client';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price_inr: number;
  duration_days: number;
  features: string[];
}

export interface SubscriptionStatus {
  is_premium: boolean;
  subscription: {
    id: string;
    plan_name: string;
    price_inr: number;
    started_at: string;
    expires_at: string;
    status: string;
  } | null;
}

const SubscriptionService = {
  async getPlans(): Promise<Plan[]> {
    const res = await apiClient.get<Plan[]>('/subscriptions/plans');
    return res.data ?? [];
  },

  async getStatus(): Promise<SubscriptionStatus> {
    const res = await apiClient.get<SubscriptionStatus>('/subscriptions/status');
    return res.data!;
  },

  async getHistory(page = 1) {
    return apiClient.get(`/subscriptions/history?page=${page}`);
  },
};

export default SubscriptionService;
