import { apiClient } from './api-client';

export interface ActiveRoutePayload {
  city: string;
  state: string;
  vehicle_type: string;
  availability_date: string;
  radius_km?: number;
  preferred_route?: string;
}

export interface MatchReason {
  label: string;
  type: 'city' | 'state' | 'vehicle' | 'date' | 'premium' | 'route';
}

export interface MatchedTrip {
  id: string;
  from_city: string;
  from_state: string;
  to_city: string;
  to_state: string;
  trip_date: string;
  trip_time: string;
  vehicle_type: string;
  load_type: string;
  weight_tons?: number;
  expected_fare?: number;
  is_premium_vendor: boolean;
  contacts_count: number;
  vendor_name: string;
  vendor_city: string;
  is_contact_locked: boolean;
  match_score: number;
  match_reasons: MatchReason[];
  created_at: string;
}

const DriverService = {
  async getProfile() {
    const res = await apiClient.get<{ user: unknown; profile: unknown; is_premium: boolean }>('/driver/profile');
    return res.data!;
  },

  async setActiveRoute(payload: ActiveRoutePayload) {
    const res = await apiClient.post<{ active: boolean; expires_at: string }>('/driver/route', payload);
    return res.data!;
  },

  async getMatchedTrips() {
    const res = await apiClient.get<{
      route: ActiveRoutePayload;
      trips: MatchedTrip[];
      total: number;
      is_premium: boolean;
    }>('/driver/route/matches');
    return res.data!;
  },

  async deactivateRoute() {
    await apiClient.delete('/driver/route');
  },
};

export default DriverService;
