import { http, HttpResponse } from 'msw';
import { 
  mockUsers, 
  mockEvents, 
  mockTicketTypes, 
  mockOrders, 
  mockAnalytics,
  mockCompanies,
  mockAnalyticsData,
  mockAttendees
} from './data';

// Auth handlers
export const authHandlers = [
  // Login
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any;
    
    // Simple validation
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password123') {
      return HttpResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        user,
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      },
    });
  }),

  // Register
  http.post('/api/auth/register', async ({ request }) => {
    const userData = await request.json() as any;
    
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      permissions: userData.role === 'organizer' 
        ? ['events:create', 'events:manage', 'analytics:view']
        : ['orders:view'],
      createdAt: new Date(),
    };

    return HttpResponse.json({
      success: true,
      data: {
        user: newUser,
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
    });
  }),

  // Get current user
  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: mockUsers[0],
    });
  }),

  // Refresh token
  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: 'new-mock-access-token',
        refreshToken: 'new-mock-refresh-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }),
];

// Event handlers
export const eventHandlers = [
  // Get events
  http.get('/api/events', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search');

    let filteredEvents = mockEvents;
    
    if (search) {
      filteredEvents = mockEvents.filter(event => 
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedEvents = filteredEvents.slice(start, end);

    return HttpResponse.json({
      success: true,
      data: {
        events: paginatedEvents,
        meta: {
          page,
          limit,
          total: filteredEvents.length,
          hasNext: end < filteredEvents.length,
        },
      },
    });
  }),

  // Get single event
  http.get('/api/events/:id', ({ params }) => {
    const event = mockEvents.find(e => e.id === params.id);
    if (!event) {
      return HttpResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: event,
    });
  }),

  // Create event
  http.post('/api/events', async ({ request }) => {
    const eventData = await request.json() as any;
    
    const newEvent = {
      id: `event-${Date.now()}`,
      ...eventData,
      tickets: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return HttpResponse.json({
      success: true,
      data: newEvent,
    });
  }),

  // Update event
  http.put('/api/events/:id', async ({ params, request }) => {
    const updates = await request.json() as any;
    const eventIndex = mockEvents.findIndex(e => e.id === params.id);
    
    if (eventIndex === -1) {
      return HttpResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    const updatedEvent = {
      ...mockEvents[eventIndex],
      ...updates,
      updatedAt: new Date(),
    };

    mockEvents[eventIndex] = updatedEvent;

    return HttpResponse.json({
      success: true,
      data: updatedEvent,
    });
  }),
];

// Ticket handlers
export const ticketHandlers = [
  // Get tickets for event
  http.get('/api/events/:eventId/tickets', ({ params }) => {
    const eventTickets = mockTicketTypes.filter(t => t.eventId === params.eventId);
    
    return HttpResponse.json({
      success: true,
      data: eventTickets,
    });
  }),

  // Create ticket type
  http.post('/api/events/:eventId/tickets', async ({ params, request }) => {
    const ticketData = await request.json() as any;
    
    const newTicket = {
      id: `ticket-${Date.now()}`,
      eventId: params.eventId as string,
      ...ticketData,
    };

    return HttpResponse.json({
      success: true,
      data: newTicket,
    });
  }),

  // Hold tickets
  http.post('/api/tickets/:ticketId/hold', async ({ params, request }) => {
    const { quantity, userId } = await request.json() as any;
    
    // Simulate hold logic
    return HttpResponse.json({
      success: true,
      data: { held: quantity, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
    });
  }),

  // Release hold
  http.post('/api/tickets/:ticketId/release', async ({ params, request }) => {
    const { userId } = await request.json() as any;
    
    return HttpResponse.json({
      success: true,
      data: { released: true },
    });
  }),
];

// Order handlers
export const orderHandlers = [
  // Get orders
  http.get('/api/orders', () => {
    return HttpResponse.json({
      success: true,
      data: {
        orders: mockOrders,
        meta: {
          page: 1,
          limit: 10,
          total: mockOrders.length,
          hasNext: false,
        },
      },
    });
  }),

  // Create order
  http.post('/api/orders', async ({ request }) => {
    const orderData = await request.json() as any;
    
    const newOrder = {
      id: `order-${Date.now()}`,
      ...orderData,
      status: 'confirmed',
      qrCode: `QR${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return HttpResponse.json({
      success: true,
      data: newOrder,
    });
  }),
];

// Analytics handlers
export const analyticsHandlers = [
  // Get analytics snapshot
  http.get('/api/events/:eventId/analytics', ({ params }) => {
    const analytics = mockAnalytics.find(a => a.eventId === params.eventId);
    
    if (!analytics) {
      return HttpResponse.json(
        { success: false, message: 'Analytics not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: analytics,
    });
  }),

  // Get dashboard stats
  http.get('/api/analytics/dashboard', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalEvents: mockEvents.length,
        activeEvents: mockEvents.filter(e => e.status === 'published').length,
        totalRevenue: 4250000,
        totalTicketsSold: 21700,
        recentOrders: mockOrders.slice(0, 5),
      },
    });
  }),

  // Get analytics data
  http.get('/api/analytics/sales-trend', () => {
    return HttpResponse.json({
      success: true,
      data: mockAnalyticsData.salesTrend,
    });
  }),

  http.get('/api/analytics/ticket-distribution', () => {
    return HttpResponse.json({
      success: true,
      data: mockAnalyticsData.ticketDistribution,
    });
  }),

  http.get('/api/analytics/event-performance', () => {
    return HttpResponse.json({
      success: true,
      data: mockAnalyticsData.eventPerformance,
    });
  }),
];

// Attendee handlers
export const attendeeHandlers = [
  // Get attendees
  http.get('/api/attendees', ({ request }) => {
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId');
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');

    let filteredAttendees = mockAttendees;
    
    if (eventId && eventId !== 'all') {
      filteredAttendees = filteredAttendees.filter(a => a.eventId === eventId);
    }
    
    if (search) {
      filteredAttendees = filteredAttendees.filter(a => 
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status && status !== 'all') {
      if (status === 'checked-in') {
        filteredAttendees = filteredAttendees.filter(a => a.checkedIn);
      } else if (status === 'not-checked-in') {
        filteredAttendees = filteredAttendees.filter(a => !a.checkedIn);
      }
    }

    return HttpResponse.json({
      success: true,
      data: {
        attendees: filteredAttendees,
        stats: {
          total: mockAttendees.length,
          checkedIn: mockAttendees.filter(a => a.checkedIn).length,
          notCheckedIn: mockAttendees.filter(a => !a.checkedIn).length,
        },
      },
    });
  }),

  // Check in attendee
  http.post('/api/attendees/:id/checkin', ({ params }) => {
    const attendee = mockAttendees.find(a => a.id === params.id);
    if (!attendee) {
      return HttpResponse.json(
        { success: false, message: 'Attendee not found' },
        { status: 404 }
      );
    }

    attendee.checkedIn = true;
    attendee.checkedInAt = new Date();

    return HttpResponse.json({
      success: true,
      data: attendee,
    });
  }),
];

export const handlers = [
  ...authHandlers,
  ...eventHandlers,
  ...ticketHandlers,
  ...orderHandlers,
  ...analyticsHandlers,
  ...attendeeHandlers,
];