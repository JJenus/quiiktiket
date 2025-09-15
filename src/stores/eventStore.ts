import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Event, LoadingState, PaginationParams, FilterParams } from '../types';
import { apiClient } from '../api/client';

interface EventState {
  eventsById: Record<string, Event>;
  eventsList: string[];
  currentEvent: Event | null;
  loading: LoadingState;
  error: string | null;
  filters: FilterParams;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

interface EventActions {
  fetchEvents: (params?: PaginationParams & FilterParams) => Promise<void>;
  fetchEvent: (id: string) => Promise<void>;
  createEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Event>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  publishEvent: (id: string) => Promise<void>;
  unpublishEvent: (id: string) => Promise<void>;
  setCurrentEvent: (event: Event | null) => void;
  setFilters: (filters: Partial<FilterParams>) => void;
  clearError: () => void;
}

type EventStore = EventState & EventActions;

export const useEventStore = create<EventStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    eventsById: {},
    eventsList: [],
    currentEvent: null,
    loading: 'idle',
    error: null,
    filters: {},
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      hasNext: false,
    },

    // Actions
    fetchEvents: async (params = {}) => {
      try {
        set({ loading: 'loading', error: null });

        const response = await apiClient.get<{
          events: Event[];
          meta: {
            page: number;
            limit: number;
            total: number;
            hasNext: boolean;
          };
        }>('/events', {
          ...get().filters,
          ...params,
        });

        const { events, meta } = response.data;
        const eventsById: Record<string, Event> = {};
        const eventsList: string[] = [];

        events.forEach((event) => {
          eventsById[event.id] = event;
          eventsList.push(event.id);
        });

        set({
          eventsById: params.page === 1 ? eventsById : { ...get().eventsById, ...eventsById },
          eventsList: params.page === 1 ? eventsList : [...get().eventsList, ...eventsList],
          pagination: meta,
          loading: 'success',
          error: null,
        });
      } catch (error: any) {
        set({
          loading: 'error',
          error: error.message || 'Failed to fetch events',
        });
        throw error;
      }
    },

    fetchEvent: async (id: string) => {
      try {
        set({ loading: 'loading', error: null });

        const response = await apiClient.get<Event>(`/events/${id}`);
        const event = response.data;

        set((state) => ({
          eventsById: {
            ...state.eventsById,
            [event.id]: event,
          },
          currentEvent: event,
          loading: 'success',
          error: null,
        }));
      } catch (error: any) {
        set({
          loading: 'error',
          error: error.message || 'Failed to fetch event',
        });
        throw error;
      }
    },

    createEvent: async (eventData) => {
      try {
        set({ loading: 'loading', error: null });

        const response = await apiClient.post<Event>('/events', eventData);
        const newEvent = response.data;

        set((state) => ({
          eventsById: {
            ...state.eventsById,
            [newEvent.id]: newEvent,
          },
          eventsList: [newEvent.id, ...state.eventsList],
          currentEvent: newEvent,
          loading: 'success',
          error: null,
        }));

        return newEvent;
      } catch (error: any) {
        set({
          loading: 'error',
          error: error.message || 'Failed to create event',
        });
        throw error;
      }
    },

    updateEvent: async (id: string, updates) => {
      try {
        set({ loading: 'loading', error: null });

        // Optimistic update
        const currentEvent = get().eventsById[id];
        const optimisticEvent = { ...currentEvent, ...updates };
        
        set((state) => ({
          eventsById: {
            ...state.eventsById,
            [id]: optimisticEvent,
          },
          currentEvent: state.currentEvent?.id === id ? optimisticEvent : state.currentEvent,
        }));

        const response = await apiClient.put<Event>(`/events/${id}`, updates);
        const updatedEvent = response.data;

        set((state) => ({
          eventsById: {
            ...state.eventsById,
            [id]: updatedEvent,
          },
          currentEvent: state.currentEvent?.id === id ? updatedEvent : state.currentEvent,
          loading: 'success',
          error: null,
        }));

        return updatedEvent;
      } catch (error: any) {
        // Rollback optimistic update
        set((state) => ({
          eventsById: {
            ...state.eventsById,
            [id]: currentEvent,
          },
          currentEvent: state.currentEvent?.id === id ? currentEvent : state.currentEvent,
          loading: 'error',
          error: error.message || 'Failed to update event',
        }));
        throw error;
      }
    },

    deleteEvent: async (id: string) => {
      try {
        set({ loading: 'loading', error: null });

        await apiClient.delete(`/events/${id}`);

        set((state) => {
          const { [id]: removed, ...remainingEvents } = state.eventsById;
          return {
            eventsById: remainingEvents,
            eventsList: state.eventsList.filter((eventId) => eventId !== id),
            currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
            loading: 'success',
            error: null,
          };
        });
      } catch (error: any) {
        set({
          loading: 'error',
          error: error.message || 'Failed to delete event',
        });
        throw error;
      }
    },

    publishEvent: async (id: string) => {
      try {
        await get().updateEvent(id, { status: 'published' });
      } catch (error) {
        throw error;
      }
    },

    unpublishEvent: async (id: string) => {
      try {
        await get().updateEvent(id, { status: 'draft' });
      } catch (error) {
        throw error;
      }
    },

    setCurrentEvent: (event: Event | null) => {
      set({ currentEvent: event });
    },

    setFilters: (filters: Partial<FilterParams>) => {
      set((state) => ({
        filters: { ...state.filters, ...filters },
      }));
      
      // Auto-refresh events when filters change
      get().fetchEvents({ page: 1, ...get().filters, ...filters });
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);