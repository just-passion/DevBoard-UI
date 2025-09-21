import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Layout/Header';
import { fetchNotifications, markAsRead } from '../../store/slices/notificationSlice';
import type { AppDispatch, RootState } from '../../store/store';
import type { Notification } from '../../types';

const NotificationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, isLoading } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned': return '👤';
      case 'task_mentioned': return '💬';
      case 'task_status_changed': return '✅';
      case 'comment_added': return '💭';
      case 'project_invited': return '📧';
      default: return '🔔';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <button 
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => {
                    notifications.forEach(notification => {
                      if (!notification.isRead) {
                        dispatch(markAsRead(notification._id));
                      }
                    });
                  }}
                >
                  Mark all read
                </button>
              </div>
            </div>

            <div className="divide-y">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-4">🔔</div>
                  <p className="text-lg">No notifications yet</p>
                  <p className="text-sm">You'll see notifications here when there's activity on your projects.</p>
                </div>
              ) : (
                notifications.map((notification: Notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => {
                      if (!notification.isRead) {
                        handleMarkAsRead(notification._id);
                      }
                      // Navigate to related content if actionUrl exists
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                          
                          {!notification.isRead && (
                            <div className="flex-shrink-0 ml-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;