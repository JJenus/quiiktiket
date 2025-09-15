import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Ticket, 
  TrendingUp, 
  Users,
  Plus,
  ArrowUpRight,
  Activity,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatNumber } from '../lib/utils';

export const Dashboard: React.FC = () => {
  // Mock data - in real app this would come from stores
  const stats = {
    totalEvents: 12,
    activeEvents: 8,
    totalRevenue: 425000,
    totalTicketsSold: 2170,
  };

  const recentEvents = [
    {
      id: '1',
      name: 'Summer Music Festival 2024',
      date: 'Jul 15, 2024',
      sold: 18500,
      capacity: 35000,
      revenue: 2777500,
      status: 'active',
    },
    {
      id: '2',
      name: 'Tech Innovation Summit',
      date: 'Aug 22, 2024',
      sold: 1450,
      capacity: 2000,
      revenue: 434850,
      status: 'active',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'sale',
      message: '15 tickets sold for Summer Music Festival',
      time: '2 minutes ago',
      amount: 2249.85,
    },
    {
      id: '2',
      type: 'pricing',
      message: 'Dynamic pricing adjusted for VIP tickets',
      time: '5 minutes ago',
    },
    {
      id: '3',
      type: 'event',
      message: 'Tech Innovation Summit published',
      time: '1 hour ago',
    },
  ];

  const alerts = [
    {
      id: '1',
      type: 'warning',
      message: 'VIP tickets for Summer Festival are 90% sold',
      action: 'Adjust pricing',
    },
    {
      id: '2',
      type: 'info',
      message: 'New pricing suggestion available for Tech Summit',
      action: 'Review',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Create Event
        </Button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-600'
                  : 'bg-blue-50 border-blue-400 dark:bg-blue-900/20 dark:border-blue-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  ) : (
                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                  <p className="text-gray-700 dark:text-gray-300">
                    {alert.message}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  {alert.action}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Events"
          value={formatNumber(stats.totalEvents)}
          change={{ value: 12, type: 'increase', period: 'last month' }}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Active Events"
          value={formatNumber(stats.activeEvents)}
          change={{ value: 8, type: 'increase', period: 'last month' }}
          icon={Activity}
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change={{ value: 15, type: 'increase', period: 'last month' }}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Tickets Sold"
          value={formatNumber(stats.totalTicketsSold)}
          change={{ value: 23, type: 'increase', period: 'last month' }}
          icon={Ticket}
          color="blue"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Events</CardTitle>
                <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {event.name}
                      </h4>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                        {event.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {event.date}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Sold</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatNumber(event.sold)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Capacity</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatNumber(event.capacity)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Revenue</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(event.revenue)}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Sales Progress</span>
                        <span>{Math.round((event.sold / event.capacity) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(event.sold / event.capacity) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className="bg-indigo-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'sale' ? 'bg-green-500' :
                      activity.type === 'pricing' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      {activity.amount && (
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          +{formatCurrency(activity.amount)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};