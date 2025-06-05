
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Bell, Clock, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHydration } from '@/hooks/useHydration';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'appointment' | 'info';
  time: string;
  isRead: boolean;
}

const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const { logs: hydrationLogs } = useHydration();

  useEffect(() => {
    // Generate notifications based on hydration
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];
      const today = new Date().toISOString().split('T')[0];
      
      // Hydration reminder
      const todaysHydration = hydrationLogs.find(log => log.date === today);
      if (!todaysHydration || todaysHydration.liters < 2) {
        newNotifications.push({
          id: 'hydration-reminder',
          title: 'Hydration Reminder',
          message: 'Remember to stay hydrated! Aim for 3L of water today.',
          type: 'info',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        });
      }

      setNotifications(newNotifications);
    };

    if (isOpen) {
      generateNotifications();
    }
  }, [isOpen, hydrationLogs]);

  if (!isOpen) return null;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    toast({
      title: "All notifications marked as read",
    });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clock className="w-5 h-5 text-pill-navy" />;
      case 'appointment':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-pill-navy">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-pill-navy/70">{unreadCount} unread</p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-pill-navy/30 mx-auto mb-4" />
            <p className="text-pill-navy/70">No notifications yet</p>
            <p className="text-pill-navy/50 text-sm mt-2">Stay hydrated to get reminders</p>
          </div>
        ) : (
          <>
            {unreadCount > 0 && (
              <div className="p-4 border-b">
                <Button 
                  onClick={handleMarkAllAsRead}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              </div>
            )}
            
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-pill-light/50 transition-colors ${
                    !notification.isRead ? 'bg-pill-light/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium text-sm ${
                          !notification.isRead ? 'text-pill-navy' : 'text-pill-navy/70'
                        }`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-pill-navy/50">
                          {notification.time}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        !notification.isRead ? 'text-pill-navy/80' : 'text-pill-navy/60'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {!notification.isRead && (
                          <Button
                            onClick={() => handleMarkAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="text-xs h-6 px-2"
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteNotification(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2 text-red-600 hover:text-red-800"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default NotificationsPanel;
