import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Users, 
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Download,
  MoreVertical,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { formatDateTime } from '../../lib/utils';

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  eventName: string;
  ticketType: string;
  checkedIn: boolean;
  checkedInAt?: Date;
  orderDate: Date;
  qrCode: string;
}

export const AttendeeList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock attendee data
  const attendees: Attendee[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      eventName: 'Summer Music Festival 2024',
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
      eventName: 'Summer Music Festival 2024',
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
      eventName: 'Tech Innovation Summit',
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
      eventName: 'Summer Music Festival 2024',
      ticketType: 'VIP Experience',
      checkedIn: false,
      orderDate: new Date('2024-04-20T16:45:00'),
      qrCode: 'QR456789123-1',
    },
  ];

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attendee.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent = eventFilter === 'all' || attendee.eventName === eventFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'checked-in' && attendee.checkedIn) ||
                         (statusFilter === 'not-checked-in' && !attendee.checkedIn);
    return matchesSearch && matchesEvent && matchesStatus;
  });

  const stats = {
    total: attendees.length,
    checkedIn: attendees.filter(a => a.checkedIn).length,
    notCheckedIn: attendees.filter(a => !a.checkedIn).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Attendees
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and track event attendees
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export List
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Attendees
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Checked In
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.checkedIn}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {((stats.checkedIn / stats.total) * 100).toFixed(1)}% rate
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Not Checked In
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.notCheckedIn}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            leftIcon={<Search className="w-5 h-5" />}
            placeholder="Search attendees..."
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
            <option value="Summer Music Festival 2024">Summer Music Festival</option>
            <option value="Tech Innovation Summit">Tech Innovation Summit</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="checked-in">Checked In</option>
            <option value="not-checked-in">Not Checked In</option>
          </select>
          
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            More Filters
          </Button>
        </div>
      </div>

      {/* Attendees List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-white">
                    Attendee
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-white">
                    Event
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-white">
                    Ticket Type
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900 dark:text-white">
                    Order Date
                  </th>
                  <th className="text-right py-3 px-6 font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map((attendee, index) => (
                  <motion.tr
                    key={attendee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {attendee.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{attendee.email}</span>
                          </span>
                          {attendee.phone && (
                            <span className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{attendee.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {attendee.eventName}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-md">
                        {attendee.ticketType}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {attendee.checkedIn ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <div>
                              <div className="text-sm font-medium text-green-600">
                                Checked In
                              </div>
                              {attendee.checkedInAt && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDateTime(attendee.checkedInAt)}
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-red-600">
                              Not Checked In
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateTime(attendee.orderDate)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="relative group">
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                          <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <MessageSquare className="w-4 h-4" />
                            <span>Send Message</span>
                          </button>
                          <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Download className="w-4 h-4" />
                            <span>Download Ticket</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredAttendees.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No attendees found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || eventFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Attendees will appear here once tickets are sold'
            }
          </p>
        </div>
      )}
    </div>
  );
};