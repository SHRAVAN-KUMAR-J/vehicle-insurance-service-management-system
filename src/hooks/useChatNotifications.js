import { useContext } from 'react';
import { ChatNotificationContext } from '../contexts/ChatNotificationContext';

export const useChatNotifications = () => useContext(ChatNotificationContext);