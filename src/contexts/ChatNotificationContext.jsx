import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { SocketContext } from './SocketContext';
import { AuthContext } from './AuthContext';
import api from '../utils/api';

export const ChatNotificationContext = createContext();

export const ChatNotificationProvider = ({ children }) => {
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const hasFetchedInitial = useRef(false);

  const fetchUnreadChatCount = useCallback(async () => {
    try {
      const res = await api.get('/chat/unread-count');
      setUnreadChatCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Fetch unread chat count error:', err);
    }
  }, []);

  useEffect(() => {
    if (user && !hasFetchedInitial.current) {
      hasFetchedInitial.current = true;
      fetchUnreadChatCount();
    }

    if (!user) {
      hasFetchedInitial.current = false;
      setUnreadChatCount(0);
    }
  }, [user, fetchUnreadChatCount]);

  useEffect(() => {
    if (socket && user) {
      const handleNewMessage = (message) => {
        if (message.receiverId === user.id || message.receiverId._id === user.id) {
          setUnreadChatCount((prev) => prev + 1);
        }
      };

      socket.on('receive_message', handleNewMessage);

      return () => {
        socket.off('receive_message', handleNewMessage);
      };
    }
  }, [socket, user]);

  const decrementUnreadCount = useCallback((count = 1) => {
    setUnreadChatCount((prev) => Math.max(0, prev - count));
  }, []);

  return (
    <ChatNotificationContext.Provider
      value={{
        unreadChatCount,
        fetchUnreadChatCount,
        decrementUnreadCount,
      }}
    >
      {children}
    </ChatNotificationContext.Provider>
  );
};