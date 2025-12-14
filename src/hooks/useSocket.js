import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export const useSocket = () => {
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on('message_seen', ({ messageId, seenAt }) => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, seen: true, seenAt } : msg))
        );
      });
    }
  }, [socket]);

  const sendMessage = (conversationId, to, content, callback) => {
    if (socket) {
      socket.emit('send_message', { conversationId, to, content }, callback);
    }
  };

  const markMessageSeen = (messageId, conversationId) => {
    if (socket) {
      socket.emit('message_seen', { messageId, conversationId });
    }
  };

  const joinConversation = (conversationId) => {
    if (socket) {
      socket.emit('join_conversation', { conversationId });
    }
  };

  return { messages, sendMessage, markMessageSeen, joinConversation };
};