
// Vehicle types for AreaLine fleet
export enum VehicleType {
  BIKE = 'Bike',
  VAN = 'Van',
  TRUCK = 'Truck',
  SALON = 'Car',
  BUS = 'Bus',
  AEROPLANE = 'Aeroplane'
}

// User roles in the platform
export enum UserRole {
  OPERATOR = 'Driver',
  EMPLOYER = 'Boss',
  AGENT = 'Global Agent'
}

// Verification states
export enum VerificationStatus {
  UNVERIFIED = 'Unverified',
  PENDING = 'Pending Approval',
  APPROVED = 'Approved'
}

// Operating modes
export enum RouteMode {
  ROAMING = 'Roaming',
  TRIP = 'Going To',
  SPECIAL = 'Make Money',
  GLOBAL = 'Global'
}

// Registration tiers
export enum RegistrationCategory {
  LOCAL = 'Area Runs',
  INTERSTATE = 'Long Road',
  INTERNATIONAL = 'Cross Border',
  GLOBAL = 'Global Grid'
}

// Service categories
export enum ServiceType {
  LOGISTICS = 'Logistics',
  TRANSPORT = 'Transport',
  HAILING = 'Ride Hailing',
  CHARTER = 'Charter',
  COURIER = 'Courier',
  TRAVEL = 'Travel'
}

export enum TripType {
  PASSENGER = 'Passenger',
  CARGO = 'Cargo'
}

export enum AgentCategory {
  COURIER = 'Courier',
  TRAVEL = 'Travel'
}

// Detailed Registration Payload for Backend Sync
export interface RegistrationPayload {
  role: UserRole;
  country: string;
  state: string;
  tiers: RegistrationCategory[];
  nin: string;
  biometrics: {
    facialCaptured: boolean;
    siteCaptured: boolean;
  };
  agentCategory?: AgentCategory;
  bossType?: 'employer' | 'hp_owner';
}

export interface IncomingJob {
  id: string;
  vehicleType: VehicleType;
  origin: string;
  destination: string;
  price: number;
  serviceType?: ServiceType;
  duration?: string;
  category?: RegistrationCategory;
  status?: 'open' | 'claimed' | 'completed';
}

export interface OrderCluster {
  id: string;
  name: string;
  source: string;
  count: number;
  totalPrice: number;
  efficiency: number;
  orders: { id: string; pickup: string; dest: string; price: number }[];
  estimatedTime?: number;
  vehicleRequired: VehicleType;
}

export interface FleetVehicle {
  id: string;
  type: VehicleType;
  plateNumber: string;
  pilotName: string;
  pilotId: string;
  status: 'active' | 'maintenance' | 'offline';
  installmentDebt: number;
  totalRevenue: number;
  expiryDates: {
    insurance: string;
    roadWorthiness: string;
    hackneyPermit: string;
  };
}

export interface CommunityPost {
  id: string;
  user: string;
  userId: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  isJobOrder?: boolean;
  price?: number;
}

export interface GlobalLead {
  id: string;
  source: string;
  type: ServiceType;
  subType: string;
  origin: string;
  destination: string;
  payload: string;
  budget?: string;
  timestamp: string;
  apiLinked?: boolean;
}

// Chat message interface for community private chats
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isMe: boolean;
}

// User profile interface for directory and profile views
export interface UserProfile {
  name: string;
  avatar: string;
  rating: number;
  bio: string;
  registrationLevels: RegistrationCategory[];
  stats: {
    totalTrips: number;
    completionRate: number;
    reputation: number;
  };
  recentActivity?: {
    id: string;
    content: string;
    timestamp: string;
    location: string;
  }[];
}
