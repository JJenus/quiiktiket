// Core data models and TypeScript interfaces
import { z } from 'zod';

// User and Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'customer';
  companyId?: string;
  permissions: string[];
  avatar?: string;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  };
  plan: 'free' | 'pro' | 'enterprise';
  features: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// Events and Tickets
export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  venue: {
    name: string;
    address: string;
    capacity: number;
    coordinates?: { lat: number; lng: number };
  };
  startAt: Date;
  endAt: Date;
  tickets: TicketType[];
  status: 'draft' | 'published' | 'live' | 'ended' | 'cancelled';
  companyId: string;
  categoryId: string;
  images: string[];
  tags: string[];
  pricing: {
    currency: 'USD' | 'EUR' | 'GBP';
    dynamicPricingEnabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description: string;
  perks: string[];
  price: number;
  originalPrice: number;
  capacity: number;
  sold: number;
  reserved: number;
  accessLevel: 'general' | 'vip' | 'backstage' | 'premium';
  rules: {
    transferable: boolean;
    refundable: boolean;
    maxPerOrder: number;
    saleStartAt?: Date;
    saleEndAt?: Date;
  };
  displayOrder: number;
}

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  fees: number;
  tax: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  qrCode: string;
  attendees: Attendee[];
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendee {
  id: string;
  orderId: string;
  name: string;
  email: string;
  checkedIn: boolean;
  checkedInAt?: Date;
  qrCode: string;
}

// Pricing and Analytics
export interface PricingSuggestion {
  ticketTypeId: string;
  suggestedPrice: number;
  currentPrice: number;
  reason: string;
  confidence: number;
  factors: {
    demand: number;
    inventory: number;
    timeToEvent: number;
    competitorPricing: number;
  };
  createdAt: Date;
}

export interface AnalyticsSnapshot {
  eventId: string;
  timestamp: Date;
  metrics: {
    totalRevenue: number;
    totalSold: number;
    salesVelocity: number; // tickets per hour
    conversionRate: number;
    averageOrderValue: number;
  };
  breakdown: {
    ticketTypeId: string;
    sold: number;
    revenue: number;
  }[];
  projections: {
    selloutDate?: Date;
    finalRevenue: number;
    finalCapacity: number;
  };
}

// API Response types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasNext?: boolean;
  };
}

// Zod schemas for validation
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'organizer', 'customer']),
  companyId: z.string().optional(),
  permissions: z.array(z.string()),
  avatar: z.string().optional(),
  createdAt: z.date(),
});

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  shortDescription: z.string(),
  venue: z.object({
    name: z.string(),
    address: z.string(),
    capacity: z.number(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  startAt: z.date(),
  endAt: z.date(),
  status: z.enum(['draft', 'published', 'live', 'ended', 'cancelled']),
  companyId: z.string(),
  categoryId: z.string(),
  images: z.array(z.string()),
  tags: z.array(z.string()),
});

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  eventId: z.string(),
  ticketTypeId: z.string(),
  quantity: z.number(),
  total: z.number(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'refunded']),
  qrCode: z.string(),
  createdAt: z.date(),
});

// WebSocket message types
export interface WebSocketMessage {
  type: 'pricing_update' | 'sales_update' | 'inventory_update' | 'order_created';
  eventId?: string;
  ticketTypeId?: string;
  data: any;
  timestamp: Date;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
}