
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

// Verification states for pilots and ogas
export enum VerificationStatus {
  UNVERIFIED = 'Unverified',
  PENDING = 'Pending Approval',
  APPROVED = 'Approved'
}

// Operating modes for route tracking
export enum RouteMode {
  ROAMING = 'Roaming',
  TRIP = 'Going To',
  SPECIAL = 'Make Money',
  GLOBAL = 'Global'
}

// Registration tiers for area coverage
export enum RegistrationCategory {
  LOCAL = 'Area Runs',
  INTERSTATE = 'Long Road',
  INTERNATIONAL = 'Cross Border',
  GLOBAL = 'Global Grid'
}

// Specialized service categories
export enum ServiceType {
  LOGISTICS = 'Logistics',
  TRANSPORT = 'Transport',
  HAILING = 'Ride Hailing',
  CHARTER = 'Charter',
  COURIER = 'Courier',
  TRAVEL = 'Travel'
}

// Trip types for planning
export enum TripType {
  PASSENGER = 'Passenger',
  CARGO = 'Cargo'
}

// Categories for global agents
export enum AgentCategory {
  COURIER = 'Courier',
  TRAVEL = 'Travel'
}

// Job structure for incoming alerts
export interface IncomingJob {
  id: string;
  vehicleType: VehicleType;
  origin: string;
  destination: string;
  price: number;
  serviceType?: ServiceType;
  duration?: string;
  category?: RegistrationCategory;
}

// Gist/News feed items
export interface NewsItem {
  id: string;
  author: string;
  type: string;
  title: string;
  content: string;
  time: string;
  isOfficial: boolean;
  imageUrl: string;
}

// Grouped orders for efficiency missions
export interface OrderCluster {
  id: string;
  name: string;
  source: string;
  count: number;
  totalPrice: number;
  efficiency: number;
  orders: { id: string; pickup: string; dest: string; price: number }[];
  estimatedTime?: number;
}

// Fleet vehicle management structure
export interface FleetVehicle {
  id: string;
  type: VehicleType;
  plateNumber: string;
  pilotName: string;
  status: 'active' | 'maintenance' | 'offline';
  installmentDebt: number;
  expiryDates: {
    insurance: string;
    roadWorthiness: string;
    hackneyPermit: string;
  };
}

// Community social feed structure
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

// Messaging structure
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isMe: boolean;
}

// Detailed pilot profile
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  rating: number;
  joinedDate: string;
  bio: string;
  services: ServiceType[];
  stats: {
    totalTrips: number;
    completionRate: number;
    reputation: number;
  };
  recentActivity: {
    id: string;
    content: string;
    timestamp: string;
    location: string;
  }[];
  registrationLevels: RegistrationCategory[];
  verificationStatus: VerificationStatus;
  activeVehicle: VehicleType;
}

// Global market leads for agents
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
