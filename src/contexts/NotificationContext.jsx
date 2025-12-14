import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { SocketContext } from './SocketContext';
import { AuthContext } from './AuthContext';
import api from '../utils/api';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const hasFetchedInitial = useRef(false);

  const fetchNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const { page = 1, limit = 20, seen, type } = params;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      if (seen !== undefined) queryParams.append('seen', seen);
      if (type) queryParams.append('type', type);

      const res = await api.get(`/notification?${queryParams.toString()}`);
      
      if (page === 1) {
        setNotifications(res.data.data);
      } else {
        setNotifications((prev) => [...prev, ...res.data.data]);
      }
      
      // Update unread count from fetched notifications
      const unread = res.data.data.filter(n => !n.isSeen).length;
      if (page === 1) {
        setUnreadCount(unread);
      } else {
        setUnreadCount(prev => prev + unread);
      }
      
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Fetch notifications error:', err);
      setError(err.response?.data?.message || 'Failed to fetch notifications');
      setLoading(false);
      throw err;
    }
  }, []);

  // Fetch notification stats to get accurate unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get('/notification/stats');
      setUnreadCount(res.data.totalUnseen || 0);
    } catch (err) {
      console.error('Fetch unread count error:', err);
    }
  }, []);

  // Initial fetch when user is authenticated
  useEffect(() => {
    if (user && !hasFetchedInitial.current) {
      hasFetchedInitial.current = true;
      fetchNotifications({ page: 1, limit: 20 });
      fetchUnreadCount();
    }
    
    // Reset when user logs out
    if (!user) {
      hasFetchedInitial.current = false;
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  // Socket listener for real-time notifications
  useEffect(() => {
    if (socket && user) {
      const handleNotification = (notification) => {
        console.log('New notification received:', notification);
        setNotifications((prev) => [notification, ...prev]);
        
        // Increment unread count if notification is unseen
        if (!notification.isSeen) {
          setUnreadCount((prev) => prev + 1);
        }
      };

      socket.on('notification', handleNotification);

      return () => {
        socket.off('notification', handleNotification);
      };
    }
  }, [socket, user]);

  const markAsSeen = async (notificationId) => {
    try {
      await api.put(`/notification/${notificationId}/seen`);
      
      setNotifications((prev) =>
        prev.map((n) => {
          if (n._id === notificationId && !n.isSeen) {
            // Decrement unread count
            setUnreadCount((count) => Math.max(0, count - 1));
            return { ...n, isSeen: true, seenAt: new Date() };
          }
          return n;
        })
      );
    } catch (err) {
      console.error('Mark as seen error:', err);
      throw err;
    }
  };

  const markAllAsSeen = async () => {
    try {
      await api.put('/notification/mark-all-seen');
      setNotifications((prev) => prev.map((n) => ({ ...n, isSeen: true, seenAt: new Date() })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all as seen error:', err);
      throw err;
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        fetchNotifications, 
        markAsSeen, 
        markAllAsSeen, 
        loading, 
        error,
        unreadCount,
        fetchUnreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};