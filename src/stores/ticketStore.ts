import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { TicketType, LoadingState } from '../types';
import { apiClient } from '../api/client';

interface ReservationHold {
  ticketTypeId: string;
  quantity: number;
  userId: string;
  expiresAt: Date;
}

interface TicketState {
  ticketTypesByEvent: Record<string, TicketType[]>;
  reservationHolds: ReservationHold[];
  loading: LoadingState;
  error: string | null;
}

interface TicketActions {
  fetchTicketTypes: (eventId: string) => Promise<void>;
  createTicketType: (eventId: string, ticketData: Omit<TicketType, 'id' | 'eventId'>) => Promise<TicketType>;
  updateTicketType: (id: string, updates: Partial<TicketType>) => Promise<TicketType>;
  deleteTicketType: (id: string) => Promise<void>;
  holdTickets: (ticketTypeId: string, quantity: number, userId: string) => Promise<void>;
  releaseHold: (ticketTypeId: string, userId: string) => void;
  getAvailableQuantity: (ticketTypeId: string) => number;
  clearError: () => void;
}

type TicketStore = TicketState & TicketActions;

export const useTicketStore = create<TicketStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    ticketTypesByEvent: {},
    reservationHolds: [],
    loading: 'idle',
    error: null,

    // Actions
    fetchTicketTypes: async (eventId: string) => {
      try {
        set({ loading: 'loading', error: null });

        const response = await apiClient.get<TicketType[]>(`/events/${eventId}/tickets`);
        const ticketTypes = response.data;

        set((state) => ({
          ticketTypesByEvent: {
            ...state.ticketTypesByEvent,
            [eventId]: ticketTypes,
          },
          loading: 'success',
          error: null,
        }));
      } catch (error: any) {
        set({
          loading: 'error',
          error: error.message || 'Failed to fetch ticket types',
        });
        throw error;
      }
    },

    createTicketType: async (eventId: string, ticketData) => {
      try {
        set({ loading: 'loading', error: null });

        const response = await apiClient.post<TicketType>(`/events/${eventId}/tickets`, {
          ...ticketData,
          eventId,
        });
        const newTicketType = response.data;

        set((state) => ({
          ticketTypesByEvent: {
            ...state.ticketTypesByEvent,
            [eventId]: [
              ...(state.ticketTypesByEvent[eventId] || []),
              newTicketType,
            ],
          },
          loading: 'success',
          error: null,
        }));

        return newTicketType;
      } catch (error: any) {
        set({
          loading: 'error',
          error: error.message || 'Failed to create ticket type',
        });
        throw error;
      }
    },

    updateTicketType: async (id: string, updates) => {
      try {
        set({ loading: 'loading', error: null });

        const response = await apiClient.put<TicketType>(`/tickets/${id}`, updates);
        const updatedTicketType = response.data;

        set((state) => {
          const newTicketTypesByEvent = { ...state.ticketTypesByEvent };
          
          // Find and update the ticket type in the correct event
          Object.keys(newTicketTypesByEvent).forEach((eventId) => {
            const ticketTypeIndex = newTicketTypesByEvent[eventId].findIndex(
              (ticket) => ticket.id === id
            );
            if (ticketTypeIndex !== -1) {
              newTicketTypesByEvent[eventId][ticketTypeIndex] = updatedTicketType;
            }
          });

          return {
            ticketTypesByEvent: newTicketTypesByEvent,
            loading: 'success',
            error: null,
          };
        });

        return updatedTicketType;
      } catch (error: any) {
        set({
          loading: 'error',
          error: error.message || 'Failed to update ticket type',
        });
        throw error;
      }
    },

    deleteTicketType: async (id: string) => {
      try {
        set({ loading: 'loading', error: null });

        await apiClient.delete(`/tickets/${id}`);

        set((state) => {
          const newTicketTypesByEvent = { ...state.ticketTypesByEvent };
          
          // Remove the ticket type from the correct event
          Object.keys(newTicketTypesByEvent).forEach((eventId) => {
            newTicketTypesByEvent[eventId] = newTicketTypesByEvent[eventId].filter(
              (ticket) => ticket.id !== id
            );
          });

          return {
            ticketTypesByEvent: newTicketTypesByEvent,
            loading: 'success',
            error: null,
          };
        });
      } catch (error: any) {
        set({
          loading: 'error',
          error: error.message || 'Failed to delete ticket type',
        });
        throw error;
      }
    },

    holdTickets: async (ticketTypeId: string, quantity: number, userId: string) => {
      try {
        // Check availability first
        const availableQuantity = get().getAvailableQuantity(ticketTypeId);
        if (availableQuantity < quantity) {
          throw new Error('Not enough tickets available');
        }

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15-minute hold

        const hold: ReservationHold = {
          ticketTypeId,
          quantity,
          userId,
          expiresAt,
        };

        set((state) => ({
          reservationHolds: [...state.reservationHolds, hold],
        }));

        // Auto-release after expiration
        setTimeout(() => {
          get().releaseHold(ticketTypeId, userId);
        }, 15 * 60 * 1000);

        // Notify server about the hold
        await apiClient.post(`/tickets/${ticketTypeId}/hold`, {
          quantity,
          userId,
        });
      } catch (error: any) {
        set({
          error: error.message || 'Failed to hold tickets',
        });
        throw error;
      }
    },

    releaseHold: (ticketTypeId: string, userId: string) => {
      set((state) => ({
        reservationHolds: state.reservationHolds.filter(
          (hold) => !(hold.ticketTypeId === ticketTypeId && hold.userId === userId)
        ),
      }));

      // Notify server about the release
      apiClient.post(`/tickets/${ticketTypeId}/release`, { userId }).catch((error) => {
        console.error('Failed to release hold on server:', error);
      });
    },

    getAvailableQuantity: (ticketTypeId: string) => {
      const state = get();
      
      // Find the ticket type
      let ticketType: TicketType | undefined;
      Object.values(state.ticketTypesByEvent).forEach((tickets) => {
        const found = tickets.find((ticket) => ticket.id === ticketTypeId);
        if (found) ticketType = found;
      });

      if (!ticketType) return 0;

      // Calculate held quantity
      const heldQuantity = state.reservationHolds
        .filter((hold) => hold.ticketTypeId === ticketTypeId)
        .reduce((sum, hold) => sum + hold.quantity, 0);

      return Math.max(0, ticketType.capacity - ticketType.sold - ticketType.reserved - heldQuantity);
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);

// Clean up expired holds periodically
setInterval(() => {
  const state = useTicketStore.getState();
  const now = new Date();
  const expiredHolds = state.reservationHolds.filter((hold) => hold.expiresAt <= now);
  
  expiredHolds.forEach((hold) => {
    state.releaseHold(hold.ticketTypeId, hold.userId);
  });
}, 60000); // Check every minute