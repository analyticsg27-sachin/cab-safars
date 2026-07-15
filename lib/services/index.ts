/**
 * Service layer entry point.
 *
 * Set NEXT_PUBLIC_DATA_MODE=mock  → use local demo data (Vercel preview, no backend)
 * Set NEXT_PUBLIC_DATA_MODE=api   → hit real PHP backend (production)
 *
 * Default: mock (safe for preview deployments)
 */

export const DATA_MODE = (process.env.NEXT_PUBLIC_DATA_MODE ?? 'mock') as 'mock' | 'api';
export const IS_API_MODE = DATA_MODE === 'api';

export { default as AuthService }             from './auth.service';
export { default as TripsService }            from './trips.service';
export { default as DriverService }           from './driver.service';
export { default as SubscriptionService }     from './subscription.service';
export { default as PaymentService }          from './payment.service';
export { default as NotificationsService }    from './notifications.service';
export { default as AdminService }            from './admin.service';
export { apiClient, setTokens, clearTokens }  from './api-client';
export type { ApiResponse, ApiError }         from './api-client';
