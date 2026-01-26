'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, DollarSign, FolderOpen, MapPin, AlertCircle, Filter, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { notificationService, Notification } from '@/services/notificationService';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'DONATION_RECEIVED':
    case 'DONATION_COMPLETED':
    case 'DONATION_FAILED':
      return DollarSign;
    case 'PROJECT_CREATED':
    case 'PROJECT_UPDATED':
    case 'PROJECT_COMPLETED':
      return FolderOpen;
    case 'VISIT_SCHEDULED':
    case 'VISIT_COMPLETED':
      return MapPin;
    case 'USER_REGISTERED':
      return Users;
    default:
      return AlertCircle;
  }
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', 'paginated', page, filter],
    queryFn: () => {
      if (filter === 'unread') {
        return notificationService.getUnreadNotifications().then(notifications => ({
          notifications,
          currentPage: 0,
          totalPages: 1,
          totalElements: notifications.length,
          hasMore: false
        }));
      }
      return notificationService.getNotifications(page, 20);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const filteredNotifications = notificationsData?.notifications || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Stack on mobile, row on desktop */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm sm:text-base text-gray-600">Stay updated with your organization&apos;s activities</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Select value={filter} onValueChange={(value: 'all' | 'unread') => setFilter(value)}>
            <SelectTrigger className="w-28 sm:w-32 text-sm bg-white text-gray-900 border-gray-300 hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg">
              <SelectItem value="all" className="text-gray-900 hover:bg-primary-50 focus:bg-primary-50">All</SelectItem>
              <SelectItem value="unread" className="text-gray-900 hover:bg-primary-50 focus:bg-primary-50">Unread</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            className="px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-md hover:bg-primary-50 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 hover:text-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2"
          >
            <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:inline">Mark all read</span>
            <span className="xs:hidden sm:hidden">Read all</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No notifications</h3>
            <p className="text-sm sm:text-base text-gray-500">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'p-3 sm:p-4 md:p-6 hover:bg-gray-50 transition-colors cursor-pointer',
                    !notification.isRead && 'bg-blue-50/30 border-l-4 border-l-primary-500'
                  )}
                  onClick={() => !notification.isRead && markAsReadMutation.mutate(notification.id)}
                >
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    {/* Icon - smaller on mobile */}
                    <div className="p-2 sm:p-2.5 md:p-3 rounded-full bg-primary-50 text-primary-600 flex-shrink-0">
                      <Icon className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1 truncate sm:whitespace-normal">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 line-clamp-2 sm:line-clamp-none">
                            {notification.message}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="text-xs sm:text-sm text-gray-500">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                            <Badge
                              variant={notification.isRead ? 'secondary' : 'default'}
                              className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1"
                            >
                              {notification.isRead ? 'Read' : 'Unread'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination - responsive */}
        {notificationsData && notificationsData.totalPages > 1 && (
          <div className="p-3 sm:p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="text-xs sm:text-sm"
              >
                Previous
              </Button>
              <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                {page + 1} / {notificationsData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= notificationsData.totalPages - 1}
                className="text-xs sm:text-sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
