import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Ticket, 
  Users,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useTicketStore } from '../../stores/ticketStore';
import { useEventStore } from '../../stores/eventStore';
import { formatCurrency, formatNumber } from '../../lib/utils';

export const TicketList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const { ticketTypesByEvent, loading } = useTicketStore();
  const { eventsById, eventsList, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Flatten all ticket types from all events
  const allTicketTypes = Object.entries(ticketTypesByEvent).flatMap(([eventId, tickets]) =>
    tickets.map(ticket => ({
      ...ticket,
      event: eventsById[eventId],
    }))
  );

  const filteredTickets = allTicketTypes.filter(ticket => {
    const matchesSearch = ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.event?.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent = eventFilter === 'all' || ticket.eventId === eventFilter;
    return matchesSearch && matchesEvent;
  });

  const getAvailabilityStatus = (ticket: any) => {
    const available = ticket.capacity - ticket.sold - ticket.reserved;
    const percentage = (available / ticket.capacity) * 100;
    
    if (percentage <= 10) return { status: 'critical', color: 'text-red-600', bg: 'bg-red-100' };
    if (percentage <= 25) return { status: 'low', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-100' };
  };

  if (loading === 'loading') {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-64"></div>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-300 rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ticket Types
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage ticket types across all your events
          </p>
        </div>
        
        <Link to="/events/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Create Event
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            leftIcon={<Search className="w-5 h-5" />}
            placeholder="Search ticket types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Events</option>
            {eventsList.map((eventId, index) => {
              const event = eventsById[eventId];
              return event ? (
                <option key={`${eventId}-${index}`} value={eventId}>{event.title}</option>
              ) : null;
            })}
          </select>
          
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            More Filters
          </Button>
        </div>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No ticket types found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || eventFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create an event to start adding ticket types'
            }
          </p>
          <Link to="/events/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Create Your First Event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket, index) => {
            const availability = getAvailabilityStatus(ticket);
            const available = ticket.capacity - ticket.sold - ticket.reserved;
            const soldPercentage = (ticket.sold / ticket.capacity) * 100;

            return (
              <motion.div
                key={`${ticket.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {ticket.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${availability.bg} ${availability.color}`}>
                          {available} available
                        </span>
                        {availability.status === 'critical' && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {ticket.event?.title}
                      </p>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {ticket.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Price</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(ticket.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Sold</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatNumber(ticket.sold)} / {formatNumber(ticket.capacity)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Revenue</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(ticket.sold * ticket.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Conversion</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {soldPercentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Sales Progress</span>
                          <span>{soldPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${soldPercentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`h-2 rounded-full ${
                              availability.status === 'critical' ? 'bg-red-500' :
                              availability.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      <div className="relative group">
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/events/${ticket.eventId}`}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Event</span>
                          </Link>
                          <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Edit className="w-4 h-4" />
                            <span>Edit Ticket</span>
                          </button>
                          <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Ticket</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};