export interface AppTrip {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorPhone: string;
  fromCity: string;
  toCity: string;
  fromState: string;
  toState: string;
  vehicleType: string;
  loadType: string;
  tripDate: string;
  tripTime: string;
  expectedFare?: number;
  weightTons?: number;
  notes?: string;
  status: 'open' | 'closed' | 'cancelled';
  isPremiumVendor: boolean;
  contactsCount: number;
  contactedDrivers: ContactedDriver[];
  closureType?: 'app_driver' | 'outside_driver';
  closedDriverId?: string;
  closureNotes?: string;
  createdAt: string;
  // Location data
  latFrom?: number;
  lngFrom?: number;
  latTo?: number;
  lngTo?: number;
  // Expiry
  expiryHours?: number;
  expiresAt?: string;
}

export interface ContactedDriver {
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleType: string;
  city: string;
  isPremium: boolean;
  contactMethod: 'call' | 'whatsapp';
  contactedAt: string;
}

export interface AppNotification {
  id: string;
  type:
    | 'trip_posted'
    | 'driver_contacted'
    | 'trip_closed'
    | 'account_approved'
    | 'premium_activated'
    | 'premium_expiring'
    | 'route_match';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  tripId?: string;
}

export interface ActiveRoute {
  id: string;
  fromCity: string;
  toCity: string;
  travelDate: string;
  travelTime: string;
  radiusKm: number;
  expiresAt: string;
  isActive: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'vendor' | 'driver';
  status: 'pending' | 'active' | 'rejected';
  isPremium: boolean;
  premiumExpiry?: string;
  city: string;
  companyName?: string;
  vehicleType?: string;
}
