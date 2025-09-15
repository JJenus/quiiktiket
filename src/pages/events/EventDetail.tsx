import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Edit,
  Share2,
  MoreVertical,
  TrendingUp,
  Ticket,
  DollarSign,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { useEventStore } from '../../stores/eventStore';
import { formatDate, formatDateTime, formatCurrency, formatNumber } from '../../lib/utils';

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentEvent, fetchEvent, loading } = useEventStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id, fetchEvent]);

  if (loading === 'loading') {
    return (
      <div className="space-y-6 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-full max-w-md mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="text-center py-12 px-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Event not found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/events" className="inline-block mt-4">
          <Button>Back to Events</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'attendees', label: 'Attendees' },
  ];

  // Mock analytics data
  const analytics = {
    totalRevenue: 2777500,
    ticketsSold: 18500,
    conversionRate: 12.5,
    averageOrderValue: 195.85,
  };

  return (
    <div className="space-y-6 p-4">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link 
          to="/events" 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Events</span>
        </Link>
        <span className="text-gray-400 dark:text-gray-600">/</span>
        <span className="text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
          {currentEvent.title}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              currentEvent.status === 'published'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : currentEvent.status === 'draft'
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {currentEvent.status}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {currentEvent.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">{formatDateTime(currentEvent.startAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">{currentEvent.venue.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{formatNumber(currentEvent.venue.capacity)} capacity</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {isMobile ? (
            <>
              <Button 
                variant="outline" 
                className="flex-1 justify-center"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                Actions
                {showMobileMenu ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
              
              {showMobileMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2 sm:hidden"
                >
                  <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />} className="justify-center">
                    Preview
                  </Button>
                  <Button variant="outline" leftIcon={<Share2 className="w-4 h-4" />} className="justify-center">
                    Share
                  </Button>
                  <Button leftIcon={<Edit className="w-4 h-4" />} className="justify-center">
                    Edit Event
                  </Button>
                </motion.div>
              )}
              
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 self-center">
                <MoreVertical className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />}>
                Preview
              </Button>
              <Button variant="outline" leftIcon={<Share2 className="w-4 h-4" />}>
                Share
              </Button>
              <Button leftIcon={<Edit className="w-4 h-4" />}>
                Edit Event
              </Button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreVertical className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(analytics.totalRevenue)}
          change={{ value: 15, type: 'increase', period: 'vs last week' }}
          icon={DollarSign}
          color="green"
          compact={isMobile}
        />
        <StatsCard
          title="Tickets Sold"
          value={formatNumber(analytics.ticketsSold)}
          change={{ value: 8, type: 'increase', period: 'vs last week' }}
          icon={Ticket}
          color="blue"
          compact={isMobile}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          change={{ value: 2, type: 'increase', period: 'vs last week' }}
          icon={TrendingUp}
          color="green"
          compact={isMobile}
        />
        <StatsCard
          title="Avg Order Value"
          value={formatCurrency(analytics.averageOrderValue)}
          change={{ value: 5, type: 'decrease', period: 'vs last week' }}
          icon={Users}
          color="yellow"
          compact={isMobile}
        />
      </div>

      {/* Tabs - Horizontal scroll on mobile */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <nav className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {currentEvent.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Venue Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {currentEvent.venue.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentEvent.venue.address}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatNumber(currentEvent.venue.capacity)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatNumber(currentEvent.venue.capacity - analytics.ticketsSold)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">Event Created</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(currentEvent.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">Sales Start</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(currentEvent.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">Event Starts</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(currentEvent.startAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentEvent.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <Card>
            <CardHeader>
              <CardTitle>Ticket Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Ticket management interface coming soon...
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed analytics dashboard coming soon...
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'attendees' && (
          <Card>
            <CardHeader>
              <CardTitle>Attendee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Attendee management interface coming soon...
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};