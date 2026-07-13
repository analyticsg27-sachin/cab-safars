export type UserRole = "vendor" | "driver" | "admin";
export type Status = "active" | "pending" | "suspended" | "rejected";
export type TripStatus = "open" | "closed" | "cancelled" | "completed";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type SubscriptionPlan = "free" | "premium";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: Status;
  city: string;
  state: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string;
}

export interface Vendor extends User {
  role: "vendor";
  companyName?: string;
  tripsPosted: number;
  totalContacts: number;
  rating: number;
  verified: boolean;
}

export interface Driver extends User {
  role: "driver";
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  tripsApplied: number;
  tripsCompleted: number;
  rating: number;
  verified: boolean;
  availableRoutes: string[];
}

export interface Trip {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCity: string;
  fromCity: string;
  toCity: string;
  fromState: string;
  toState: string;
  departureDate: string;
  returnDate?: string;
  vehicleType: string;
  seatsAvailable: number;
  estimatedFare: number;
  description?: string;
  status: TripStatus;
  contactsCount: number;
  createdAt: string;
  isPremiumRequired: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  amount: number;
  status: PaymentStatus;
  plan: SubscriptionPlan;
  gateway: string;
  transactionId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  plan: SubscriptionPlan;
  amount: number;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  status: "active" | "expired" | "cancelled";
}

export interface ContactActivity {
  id: string;
  driverId: string;
  driverName: string;
  vendorId: string;
  vendorName: string;
  tripId: string;
  tripRoute: string;
  contactedAt: string;
  isPremium: boolean;
}

export interface MonthlyStats {
  month: string;
  revenue: number;
  vendors: number;
  drivers: number;
  trips: number;
}

export interface DashboardStats {
  totalVendors: number;
  totalDrivers: number;
  activeTrips: number;
  revenueThisMonth: number;
  premiumUsers: number;
  pendingApprovals: number;
  totalContacts: number;
  subscriptionRate: number;
  vendorChange: number;
  driverChange: number;
  tripChange: number;
  revenueChange: number;
}
