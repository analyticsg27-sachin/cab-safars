import type { AppTrip } from './app-types';
import { vendorPremiumTrips } from './demo-users';

// ─── Module-level mutable trip store ─────────────────────────────────────────
// Provides in-session persistence without requiring the shared AppState context.
// All vendor screens read/write through these helpers.
let _trips: AppTrip[] = [...vendorPremiumTrips];

export function getVendorTrips(): AppTrip[] {
  return _trips;
}

export function addVendorTrip(trip: AppTrip): void {
  _trips = [trip, ..._trips];
}

export function closeVendorTrip(tripId: string, patch: Partial<AppTrip>): void {
  _trips = _trips.map(t =>
    t.id === tripId ? { ...t, ...patch, status: 'closed' as const } : t,
  );
}
