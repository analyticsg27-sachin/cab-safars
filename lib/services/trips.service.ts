import { apiClient, ApiResponse } from './api-client';

export interface Trip {
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
  notes?: string;
  status?: string;
  is_premium_vendor: boolean;
  contacts_count: number;
  vendor_name?: string;
  vendor_city?: string;
  vendor_phone?: string;
  is_contact_locked?: boolean;
  created_at: string;
}

export interface ContactedDriver {
  driver_id: number;
  driver_name: string;
  driver_phone: string;
  vehicle_type: string;
  city: string;
  is_premium: boolean;
  contact_method: 'call' | 'whatsapp';
  contacted_at: string;
}

export interface TripDetail extends Trip {
  internal_notes?: string;
  contacted_drivers?: ContactedDriver[];
  closure?: {
    type: 'app_driver' | 'outside_driver';
    closed_driver_id?: string;
    closed_driver_name?: string;
    outside_driver_name?: string;
    outside_driver_contact?: string;
    notes?: string;
    closed_at: string;
  };
}

export interface PostTripPayload {
  from_city: string;
  from_state: string;
  to_city: string;
  to_state: string;
  trip_date: string;
  trip_time?: string;
  vehicle_type: string;
  load_type?: string;
  weight_tons?: number;
  expected_fare?: number;
  notes?: string;
  expiry_hours?: number;
  lat_from?: number;
  lng_from?: number;
  lat_to?: number;
  lng_to?: number;
}

export interface CloseTripPayload {
  closure_type: 'app_driver' | 'outside_driver';
  closed_driver_id?: string;
  outside_driver_name?: string;
  outside_driver_contact?: string;
  closure_notes?: string;
}

export interface FeedFilters {
  page?: number;
  per_page?: number;
  from_city?: string;
  to_city?: string;
  vehicle_type?: string;
  load_type?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
  min_fare?: number;
  max_fare?: number;
  min_weight?: number;
  max_weight?: number;
  posted_today?: '1';
}

export interface NearbyFilters {
  lat: number;
  lng: number;
  radius?: number;
  vehicle_type?: string;
  page?: number;
}

export interface SavedSearch {
  id: number;
  name: string;
  from_city?: string;
  to_city?: string;
  vehicle_type?: string;
  radius_km?: number;
  lat?: number;
  lng?: number;
  created_at: string;
}

export interface NearbyAlertPrefs {
  is_enabled: boolean;
  radius_km: number;
  lat?: number;
  lng?: number;
  city?: string;
}

const TripsService = {
  // Vendor
  async postTrip(payload: PostTripPayload): Promise<Trip> {
    const res = await apiClient.post<Trip>('/vendor/trips', payload);
    return res.data!;
  },

  async getMyTrips(page = 1, status?: string): Promise<ApiResponse<Trip[]>> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.set('status', status);
    return apiClient.get<Trip[]>(`/vendor/trips?${q}`);
  },

  async getTripDetail(id: string): Promise<TripDetail> {
    const res = await apiClient.get<TripDetail>(`/vendor/trips/${id}`);
    return res.data!;
  },

  async closeTrip(id: string, payload: CloseTripPayload): Promise<void> {
    await apiClient.post(`/vendor/trips/${id}/close`, payload);
  },

  // Driver
  async getFeed(filters: FeedFilters = {}): Promise<ApiResponse<Trip[]>> {
    const q = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v != null && q.set(k, String(v)));
    return apiClient.get<Trip[]>(`/driver/trips?${q}`);
  },

  async getDriverTripDetail(id: string): Promise<TripDetail> {
    const res = await apiClient.get<TripDetail>(`/driver/trips/${id}`);
    return res.data!;
  },

  async logContact(tripId: string, contactMethod: 'call' | 'whatsapp'): Promise<void> {
    await apiClient.post(`/driver/trips/${tripId}/contact`, { contact_method: contactMethod });
  },

  // Trip Provider extras
  async updateTrip(id: string, payload: Partial<PostTripPayload>): Promise<Trip> {
    const res = await apiClient.put<Trip>(`/vendor/trips/${id}`, payload);
    return res.data!;
  },

  async deleteTrip(id: string): Promise<void> {
    await apiClient.delete(`/vendor/trips/${id}`);
  },

  async repostTrip(id: string, tripDate: string, expiryHours?: number): Promise<Trip> {
    const res = await apiClient.post<Trip>(`/vendor/trips/${id}/repost`, { trip_date: tripDate, expiry_hours: expiryHours });
    return res.data!;
  },

  async acceptTrip(tripId: string): Promise<void> {
    await apiClient.post(`/vendor/trips/${tripId}/accept`, {});
  },

  // Nearby search (both roles)
  async getNearby(filters: NearbyFilters): Promise<{ trips: Trip[]; radius_km: number; count: number }> {
    const q = new URLSearchParams({ lat: String(filters.lat), lng: String(filters.lng) });
    if (filters.radius) q.set('radius', String(filters.radius));
    if (filters.vehicle_type) q.set('vehicle_type', filters.vehicle_type);
    if (filters.page) q.set('page', String(filters.page));
    const res = await apiClient.get<{ trips: Trip[]; radius_km: number; count: number }>(`/trips/nearby?${q}`);
    return res.data!;
  },

  // Return trip suggestion
  async getReturnTrip(tripId: string): Promise<{ original: { from_city: string; to_city: string }; return: { from_city: string; to_city: string }; trips: Trip[] }> {
    const res = await apiClient.get(`/trips/${tripId}/return`);
    return res.data as { original: { from_city: string; to_city: string }; return: { from_city: string; to_city: string }; trips: Trip[] };
  },

  // Saved searches
  async getSavedSearches(): Promise<SavedSearch[]> {
    const res = await apiClient.get<SavedSearch[]>('/saved-searches');
    return res.data ?? [];
  },

  async saveSearch(payload: Partial<SavedSearch>): Promise<SavedSearch> {
    const res = await apiClient.post<SavedSearch>('/saved-searches', payload);
    return res.data!;
  },

  async deleteSavedSearch(id: number): Promise<void> {
    await apiClient.delete(`/saved-searches/${id}`);
  },

  // Nearby alerts
  async getNearbyAlertPrefs(): Promise<NearbyAlertPrefs> {
    const res = await apiClient.get<NearbyAlertPrefs>('/nearby-alerts');
    return res.data!;
  },

  async updateNearbyAlertPrefs(prefs: NearbyAlertPrefs): Promise<NearbyAlertPrefs> {
    const res = await apiClient.put<NearbyAlertPrefs>('/nearby-alerts', prefs);
    return res.data!;
  },
};

export default TripsService;
