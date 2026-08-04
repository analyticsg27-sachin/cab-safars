/**
 * Service layer entry point.
 *
 * Set NEXT_PUBLIC_DATA_MODE=mock  → use local demo data (Vercel preview, no backend)
 * Set NEXT_PUBLIC_DATA_MODE=api   → hit real PHP backend (production)
 *
 * Default: mock (safe for preview deployments)
 */

export const DATA_MODE = (process.env.NEXT_PUBLIC_DATA_MODE ?? 'mock') as 'mock' | 'api';

/**
 * Build-time flag — true when the app is configured for API mode.
 * Use IS_API_MODE for things that never change at runtime (UI layout, feature flags).
 * Use isApiMode() for data fetching — it also checks that a real token exists,
 * so demo sessions (no access_token) gracefully fall back to mock data.
 */
export const IS_API_MODE = DATA_MODE === 'api';

/**
 * Runtime check: are we in API mode AND does a real access token exist?
 * Returns false for demo logins so all pages show mock data instead of calling
 * the backend and getting 401 errors.
 */
export function isApiMode(): boolean {
  if (!IS_API_MODE) return false;
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

export { default as AuthService }             from './auth.service';
export { default as TripsService }            from './trips.service';
export { default as DriverService }           from './driver.service';
export { default as SubscriptionService }     from './subscription.service';
export { default as PaymentService }          from './payment.service';
export { default as NotificationsService }    from './notifications.service';
export { default as AdminService }            from './admin.service';
export { apiClient, setTokens, clearTokens }  from './api-client';
export type { ApiResponse, ApiError }         from './api-client';
