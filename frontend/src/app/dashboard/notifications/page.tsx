'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, DollarSign, FolderOpen, MapPin, AlertCircle, Filter } from 'lucide-react';
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
    queryFn: () => notificationService.getNotifications(page, 20),
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

  const filteredNotifications = notificationsData?.notifications.filter(n => 
    filter === 'all' || !n.isRead
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your organization&apos;s activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={(value: 'all' | 'unread') => setFilter(value)}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            variant="outline"
            size="sm"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
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
                    'p-6 hover:bg-gray-50 transition-colors cursor-pointer',
                    !notification.isRead && 'bg-blue-50/30 border-l-4 border-l-primary-500'
                  )}
                  onClick={() => !notification.isRead && markAsReadMutation.mutate(notification.id)}
                >
                  <div className="flex gap-4">
                    <div className="p-3 rounded-full bg-primary-50 text-primary-600 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                            <Badge variant={notification.isRead ? 'secondary' : 'default'}>
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

        {notificationsData && notificationsData.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm text-gray-600">
              Page {page + 1} of {notificationsData.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= notificationsData.totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}