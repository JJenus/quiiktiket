import { Event, User, TicketType, Order, AnalyticsSnapshot } from '../types';

// Mock Analytics Data
export const mockAnalyticsData = {
  salesTrend: [
    { date: '2024-01-01', sales: 1200, revenue: 24000 },
    { date: '2024-01-02', sales: 1800, revenue: 36000 },
    { date: '2024-01-03', sales: 2200, revenue: 44000 },
    { date: '2024-01-04', sales: 1600, revenue: 32000 },
    { date: '2024-01-05', sales: 2800, revenue: 56000 },
    { date: '2024-01-06', sales: 3200, revenue: 64000 },
    { date: '2024-01-07', sales: 2400, revenue: 48000 },
  ],
  ticketDistribution: [
    { name: 'General Admission', value: 18500, color: '#3B82F6' },
    { name: 'VIP', value: 3200, color: '#10B981' },
    { name: 'Premium', value: 1800, color: '#F59E0B' },
    { name: 'Student', value: 950, color: '#EF4444' },
  ],
  eventPerformance: [
    { event: 'Summer Music Festival', revenue: 2777500, tickets: 18500, conversion: 12.5 },
    { event: 'Tech Innovation Summit', revenue: 434850, tickets: 1450, conversion: 8.3 },
    { event: 'Food & Wine Expo', revenue: 156000, tickets: 780, conversion: 15.2 },
    { event: 'Art Gallery Opening', revenue: 89500, tickets: 358, conversion: 22.1 },
  ],
};

// Mock Attendees Data
export const mockAttendees = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    eventId: '1',
    eventName: 'Summer Music Festival 2024',
    ticketTypeId: '1',
    ticketType: 'General Admission',
    checkedIn: true,
    checkedInAt: new Date('2024-07-15T18:30:00'),
    orderDate: new Date('2024-03-15T14:30:00'),
    qrCode: 'QR123456789-1',
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    eventId: '1',
    eventName: 'Summer Music Festival 2024',
    ticketTypeId: '1',
    ticketType: 'General Admission',
    checkedIn: false,
    orderDate: new Date('2024-03-15T14:30:00'),
    qrCode: 'QR123456789-2',
  },
  {
    id: '3',
    name: 'Emily Chen',
    email: 'emily.chen@email.com',
    phone: '+1 (555) 987-6543',
    eventId: '2',
    eventName: 'Tech Innovation Summit',
    ticketTypeId: '3',
    ticketType: 'Conference Pass',
    checkedIn: true,
    checkedInAt: new Date('2024-08-22T09:15:00'),
    orderDate: new Date('2024-06-10T10:20:00'),
    qrCode: 'QR987654321-1',
  },
  {
    id: '4',
    name: 'David Rodriguez',
    email: 'david.rodriguez@email.com',
    eventId: '1',
    eventName: 'Summer Music Festival 2024',
    ticketTypeId: '2',
    ticketType: 'VIP Experience',
    checkedIn: false,
    orderDate: new Date('2024-04-20T16:45:00'),
    qrCode: 'QR456789123-1',
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@quiikticket.com',
    role: 'organizer',
    companyId: 'company1',
    permissions: ['events:create', 'events:manage', 'analytics:view'],
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=150',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: 'customer',
    permissions: ['orders:view'],
    createdAt: new Date('2024-02-10'),
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival 2024',
    description: 'Join us for the biggest summer music festival featuring top artists from around the world. Three days of non-stop music, food, and entertainment.',
    shortDescription: 'Three days of world-class music and entertainment',
    venue: {
      name: 'Central Park Amphitheater',
      address: '1234 Park Avenue, New York, NY 10001',
      capacity: 50000,
      coordinates: { lat: 40.7829, lng: -73.9654 },
    },
    startAt: new Date('2024-07-15T18:00:00'),
    endAt: new Date('2024-07-17T23:00:00'),
    tickets: [],
    status: 'published',
    companyId: 'company1',
    categoryId: 'music',
    images: [
      'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?w=800',
      'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=800',
    ],
    tags: ['music', 'festival', 'summer', 'outdoor'],
    pricing: {
      currency: 'USD',
      dynamicPricingEnabled: true,
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '2',
    title: 'Tech Innovation Summit',
    description: 'A premier gathering of technology leaders, innovators, and entrepreneurs. Learn about the latest trends in AI, blockchain, and emerging technologies.',
    shortDescription: 'Premier technology and innovation conference',
    venue: {
      name: 'Convention Center Downtown',
      address: '500 Convention Blvd, San Francisco, CA 94102',
      capacity: 2500,
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    startAt: new Date('2024-08-22T09:00:00'),
    endAt: new Date('2024-08-24T17:00:00'),
    tickets: [],
    status: 'published',
    companyId: 'company1',
    categoryId: 'conference',
    images: [
      'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=800',
    ],
    tags: ['technology', 'innovation', 'conference', 'networking'],
    pricing: {
      currency: 'USD',
      dynamicPricingEnabled: false,
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-20'),
  },
];

// Mock Ticket Types
export const mockTicketTypes: TicketType[] = [
  {
    id: '1',
    eventId: '1',
    name: 'General Admission',
    description: 'Access to all main stages and general festival areas',
    perks: ['Main stage access', 'Food court access', 'General parking'],
    price: 149.99,
    originalPrice: 199.99,
    capacity: 30000,
    sold: 18500,
    reserved: 1200,
    accessLevel: 'general',
    rules: {
      transferable: true,
      refundable: true,
      maxPerOrder: 8,
      saleStartAt: new Date('2024-03-01T10:00:00'),
      saleEndAt: new Date('2024-07-15T16:00:00'),
    },
    displayOrder: 1,
  },
  {
    id: '2',
    eventId: '1',
    name: 'VIP Experience',
    description: 'Premium access with exclusive perks and amenities',
    perks: [
      'VIP viewing areas',
      'Complimentary drinks',
      'VIP restrooms',
      'Express entry',
      'VIP parking',
      'Meet & greet opportunities',
    ],
    price: 399.99,
    originalPrice: 449.99,
    capacity: 5000,
    sold: 3200,
    reserved: 300,
    accessLevel: 'vip',
    rules: {
      transferable: true,
      refundable: true,
      maxPerOrder: 4,
      saleStartAt: new Date('2024-03-01T10:00:00'),
      saleEndAt: new Date('2024-07-15T16:00:00'),
    },
    displayOrder: 2,
  },
  {
    id: '3',
    eventId: '2',
    name: 'Conference Pass',
    description: 'Full access to all sessions, workshops, and networking events',
    perks: [
      'All sessions access',
      'Workshop participation',
      'Networking events',
      'Conference materials',
      'Lunch included',
    ],
    price: 299.99,
    originalPrice: 299.99,
    capacity: 2000,
    sold: 1450,
    reserved: 150,
    accessLevel: 'general',
    rules: {
      transferable: false,
      refundable: true,
      maxPerOrder: 2,
      saleStartAt: new Date('2024-04-01T09:00:00'),
      saleEndAt: new Date('2024-08-20T23:59:00'),
    },
    displayOrder: 1,
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '2',
    eventId: '1',
    ticketTypeId: '1',
    quantity: 2,
    unitPrice: 149.99,
    total: 329.98,
    fees: 29.99,
    tax: 0,
    status: 'confirmed',
    qrCode: 'QR123456789',
    attendees: [
      {
        id: '1',
        orderId: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        checkedIn: false,
        qrCode: 'QR123456789-1',
      },
      {
        id: '2',
        orderId: '1',
        name: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        checkedIn: false,
        qrCode: 'QR123456789-2',
      },
    ],
    paymentMethod: 'card',
    createdAt: new Date('2024-03-15T14:30:00'),
    updatedAt: new Date('2024-03-15T14:30:00'),
  },
];

// Mock Analytics
export const mockAnalytics: AnalyticsSnapshot[] = [
  {
    eventId: '1',
    timestamp: new Date(),
    metrics: {
      totalRevenue: 4250000,
      totalSold: 21700,
      salesVelocity: 145, // tickets per hour
      conversionRate: 12.5,
      averageOrderValue: 195.85,
    },
    breakdown: [
      {
        ticketTypeId: '1',
        sold: 18500,
        revenue: 2777500,
      },
      {
        ticketTypeId: '2',
        sold: 3200,
        revenue: 1279200,
      },
    ],
    projections: {
      selloutDate: new Date('2024-06-15T12:00:00'),
      finalRevenue: 5100000,
      finalCapacity: 32000,
    },
  },
];

// Mock real-time data generators
export function generateRealtimeUpdate() {
  const events = ['sale', 'pricing_update', 'inventory_low'];
  const event = events[Math.floor(Math.random() * events.length)];
  
  return {
    type: event,
    eventId: mockEvents[0].id,
    data: {
      ticketsSold: Math.floor(Math.random() * 10) + 1,
      newPrice: 149.99 + (Math.random() - 0.5) * 20,
      timestamp: new Date(),
    },
  };
}

export const mockCompanies = [
  {
    id: 'company1',
    name: 'EventCorp',
    slug: 'eventcorp',
    branding: {
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=150',
      primaryColor: '#4F46E5',
      secondaryColor: '#10B981',
      backgroundColor: '#F9FAFB',
    },
    plan: 'pro' as const,
    features: ['dynamic_pricing', 'analytics', 'api_access', 'custom_branding'],
  },
];