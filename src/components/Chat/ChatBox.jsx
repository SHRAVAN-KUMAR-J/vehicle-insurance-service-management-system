import { useEffect, useState, useRef, useMemo } from 'react';
import { Send, Loader2, MessageCircle, Moon, Sun, Smile, X, Clock } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import api from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import { useChatNotifications } from '../../hooks/useChatNotifications';

// Emoji data - organized by categories
const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴'],
  'Gestures': ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗'],
  'Food': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕'],
  'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '⛸️', '🥌', '🎿', '⛷️', '🏂'],
  'Travel': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬'],
  'Objects': ['⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳'],
};

// Helper function to format date as "Today", "Yesterday", or "DD/MM/YYYY"
const formatDateHeader = (date) => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isToday = messageDate.toDateString() === today.toDateString();
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();
  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return messageDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Date Header Component
function DateHeader({ date }) {
  return (
    <div className="flex justify-center my-4">
      <div className="bg-gray-200 dark:bg-gray-700 px-4 py-1 rounded-full shadow-sm">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {formatDateHeader(date)}
        </span>
      </div>
    </div>
  );
}

// Animated Heart Component (WhatsApp-like big animated love emoji, aligned to sender/receiver side)
function AnimatedHeart({ message, isSender, onSeen, senderName, receiverName, isDarkMode }) {
  const heartRef = useRef(null);

  const getInitial = () => {
    if (isSender && senderName) return senderName.charAt(0).toUpperCase();
    if (!isSender && receiverName) return receiverName.charAt(0).toUpperCase();
    return 'U';
  };

  useEffect(() => {
    if (!isSender && !message.seen && heartRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onSeen();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(heartRef.current);
      return () => observer.disconnect();
    }
  }, [isSender, message.seen, onSeen]);

  return (
    <div
      ref={heartRef}
      className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-2 max-w-[75%] ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isDarkMode ? 'bg-blue-600' : 'bg-sky-300'
        } text-white font-semibold text-sm`}>
          {getInitial()}
        </div>
        <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
          <div className="relative text-6xl animate-bounce animate-pulse my-2">
            ❤️
            {/* Optional: Add floating small hearts for more WhatsApp-like effect */}
            <div className="absolute inset-0 -top-4 -bottom-4 -left-4 -right-4">
              <span className="absolute top-1/4 left-1/4 text-2xl animate-float opacity-70">💕</span>
              <span className="absolute top-1/2 right-1/4 text-xl animate-float delay-100 opacity-60">💖</span>
              <span className="absolute bottom-1/4 left-1/2 text-lg animate-float delay-200 opacity-50">💗</span>
            </div>
          </div>
          <div className={`flex items-center gap-1 mt-1 px-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isSender && (
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {message.seen ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-20px) rotate(180deg); opacity: 0; }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}

// Helper function to get recent emojis from localStorage
const getRecentEmojis = () => {
  try {
    const stored = localStorage.getItem('recentEmojis');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

// Helper function to save recent emoji to localStorage
const saveRecentEmoji = (emoji) => {
  try {
    let recent = getRecentEmojis();
    // Remove if already exists
    recent = recent.filter(e => e !== emoji);
    // Add to beginning
    recent.unshift(emoji);
    // Keep only last 24 emojis
    recent = recent.slice(0, 24);
    localStorage.setItem('recentEmojis', JSON.stringify(recent));
  } catch (error) {
    console.error('Failed to save recent emoji:', error);
  }
};

// Emoji Picker Component
function EmojiPicker({ onSelectEmoji, onClose, isDarkMode, emojiButtonRef }) {
  const [activeCategory, setActiveCategory] = useState('Recent');
  const [recentEmojis, setRecentEmojis] = useState([]);
  const pickerRef = useRef(null);

  useEffect(() => {
    // Load recent emojis on mount
    setRecentEmojis(getRecentEmojis());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    // Add a small delay to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, emojiButtonRef]);

  const handleEmojiClick = (emoji) => {
    saveRecentEmoji(emoji);
    setRecentEmojis(getRecentEmojis());
    onSelectEmoji(emoji);
  };

  const categories = ['Recent', ...Object.keys(EMOJI_CATEGORIES)];

  const getEmojisForCategory = (category) => {
    if (category === 'Recent') {
      return recentEmojis.length > 0 ? recentEmojis : ['😀', '❤️', '👍', '🎉', '😊', '🔥', '💯', '✨'];
    }
    return EMOJI_CATEGORIES[category] || [];
  };

  return (
    <div
      ref={pickerRef}
      className={`absolute bottom-full left-0 mb-2 w-80 rounded-2xl shadow-2xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}
      style={{ zIndex: 10000 }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-3 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Emojis
        </h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-full transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Category Tabs */}
      <div className={`flex gap-1 p-2 border-b overflow-x-auto ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`} style={{ scrollbarWidth: 'thin' }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
              activeCategory === category
                ? isDarkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'Recent' && <Clock className="w-3 h-3" />}
            {category}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="p-3 h-64 overflow-y-auto">
        {activeCategory === 'Recent' && recentEmojis.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-full ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Clock className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No recent emojis</p>
            <p className="text-xs mt-1">Your recently used emojis will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-2">
            {getEmojisForCategory(activeCategory).map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEmojiClick(emoji);
                }}
                className={`text-2xl p-2 rounded-lg transition-all hover:scale-125 cursor-pointer ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                type="button"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Message Component
function Message({ message, isSender, onSeen, senderName, receiverName, isDarkMode }) {
  const messageRef = useRef(null);

  const getInitial = () => {
    if (isSender && senderName) return senderName.charAt(0).toUpperCase();
    if (!isSender && receiverName) return receiverName.charAt(0).toUpperCase();
    return 'U';
  };

  useEffect(() => {
    if (!isSender && !message.seen && messageRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onSeen();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(messageRef.current);
      return () => observer.disconnect();
    }
  }, [isSender, message.seen, onSeen]);

  return (
    <div
      ref={messageRef}
      className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-2 max-w-[75%] ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isDarkMode ? 'bg-blue-600' : 'bg-sky-300'
        } text-white font-semibold text-sm`}>
          {getInitial()}
        </div>
        <div className="flex flex-col">
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-sm relative ${
              isSender
                ? isDarkMode
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-green-200 text-gray-800 rounded-tr-sm'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-100 rounded-tl-sm border border-gray-600'
                  : 'bg-white text-gray-800 rounded-tl-sm border border-gray-200 shadow-md'
            }`}
          >
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className={`flex items-center gap-1 mt-1 px-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isSender && (
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {message.seen ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBox({ conversationId, receiverId, receiverName, receiverRole }) {
  const { user } = useAuth();
  const { messages, sendMessage, markMessageSeen, joinConversation } = useSocket();
  const { decrementUnreadCount } = useChatNotifications();
  const [content, setContent] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const processedMessageIds = useRef(new Set());
  const inputRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const getId = (val) => {
    if (!val && val !== 0) return '';
    if (typeof val === 'object') {
      return String(val._id ?? val.id ?? val.toString());
    }
    return String(val);
  };

  const currentUserId = useMemo(() => getId(user?.id ?? user?._id ?? user?._id), [user]);

  useEffect(() => {
    if (conversationId) {
      joinConversation(conversationId);
      fetchMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, messages]);

  const fetchMessages = async () => {
    if (!conversationId) return;
    try {
      setLoading(true);
      const res = await api.get(`/chat/history/${conversationId}`);
      const msgs = res.data.data || [];
      msgs.forEach((m) => {
        const id = getId(m._id ?? m.id);
        if (id) processedMessageIds.current.add(id);
      });
      setHistory(msgs);
      const unseenForMe = msgs.filter((msg) => {
        const receiver = getId(msg.receiverId);
        return (!msg.seen) && (receiver === currentUserId);
      });
      if (unseenForMe.length > 0) {
        unseenForMe.forEach((msg) => {
          const id = getId(msg._id ?? msg.id);
          if (id) {
            markMessageSeen(id, conversationId);
            decrementUnreadCount(1);
          }
        });
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!conversationId || !receiverId) {
      setError('Conversation or receiver not selected');
      return;
    }
    setSending(true);
    sendMessage(conversationId, receiverId, content, (ack) => {
      setSending(false);
      if (ack.success) {
        const msg = ack.message;
        const id = getId(msg._id ?? msg.id);
        if (id) processedMessageIds.current.add(id);
        setHistory((prev) => [...prev, msg]);
        setContent('');
        setError('');
        inputRef.current?.focus();
      } else {
        setError(ack.error || 'Failed to send message');
      }
    });
  };

  const handleMessageSeen = (message) => {
    const messageId = getId(message._id ?? message.id ?? message);
    const receiver = getId(message.receiverId ?? message.receiver);
    if (!messageId) return;
    if (receiver === currentUserId && !processedMessageIds.current.has(`seen_${messageId}`)) {
      processedMessageIds.current.add(`seen_${messageId}`);
      markMessageSeen(messageId, conversationId);
      decrementUnreadCount(1);
    }
  };

  const handleEmojiSelect = (emoji) => {
    const input = inputRef.current;
    if (!input) return;

    const cursorPosition = input.selectionStart || content.length;
    const textBefore = content.substring(0, cursorPosition);
    const textAfter = content.substring(cursorPosition);
    const newContent = textBefore + emoji + textAfter;
    
    setContent(newContent);
    setShowEmojiPicker(false);
    
    // Set cursor position after emoji
    setTimeout(() => {
      if (input) {
        input.focus();
        const newPosition = cursorPosition + emoji.length;
        input.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const combinedMessages = useMemo(() => {
    const map = new Map();
    const pushToMap = (m) => {
      const id = getId(m._id ?? m.id);
      if (!id) return;
      const existing = map.get(id);
      if (!existing) {
        map.set(id, m);
      } else {
        map.set(id, { ...existing, ...m });
      }
    };
    (history || []).forEach(pushToMap);
    (messages || []).forEach((msg) => {
      if (!conversationId) return;
      if (String(msg.conversationId) === String(conversationId) || String(msg.conversationId) === String(msg.conversation)) {
        pushToMap(msg);
      }
    });
    const arr = Array.from(map.values()).sort((a, b) => {
      const ta = new Date(a.createdAt ?? a.updatedAt ?? a.timestamp ?? 0).getTime();
      const tb = new Date(b.createdAt ?? b.updatedAt ?? b.timestamp ?? 0).getTime();
      return ta - tb;
    });
    return arr;
  }, [history, messages, conversationId]);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentDate = null;
    combinedMessages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();
    
      if (currentDate !== messageDate) {
        currentDate = messageDate;
        groups.push({ type: 'date', date: message.createdAt });
      }
    
      groups.push({ type: 'message', data: message });
    });
    return groups;
  }, [combinedMessages]);

  return (
    <div className={`flex flex-col h-[600px] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b ${
        isDarkMode
          ? 'bg-gray-900 border-gray-700'
          : 'bg-gradient-to-r from-blue-50 to-sky-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
              isDarkMode ? 'bg-blue-600' : 'bg-sky-500'
            }`}>
              {receiverName ? receiverName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                {receiverName || 'Chat'}
              </h3>
              {receiverRole && (
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-sky-600'
                }`}>
                  {receiverRole}
                </p>
              )}
            </div>
          </div>
        
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                : 'bg-white hover:bg-gray-100 text-gray-700 shadow-md'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto p-4 relative ${
          isDarkMode ? 'bg-gray-800' : ''
        }`}
        style={{
          backgroundImage: isDarkMode
            ? 'none'
            : 'url(https://wallpaperaccess.com/full/7180310.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Messages content */}
        <div className="relative z-10">
          {loading && (history.length === 0) ? (
            <div className={`flex flex-col items-center justify-center h-full ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm font-medium">Loading messages...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className={`px-4 py-2 rounded-lg font-medium shadow-sm ${
                isDarkMode
                  ? 'text-red-400 bg-red-900/20'
                  : 'text-red-700 bg-red-100'
              }`}>{error}</p>
            </div>
          ) : combinedMessages.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-full ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              <MessageCircle className="w-16 h-16 mb-4 opacity-60" />
              <p className="text-center font-medium">No messages yet.<br />Start the conversation!</p>
            </div>
          ) : (
            groupedMessages.map((item, index) => {
              if (item.type === 'date') {
                return <DateHeader key={`date-${index}`} date={item.date} />;
              }
              const message = item.data;
              const msgId = getId(message._id ?? message.id) || index;
              const senderId = getId(message.senderId ?? message.sender ?? message.from);
              const isSender = String(senderId) === String(currentUserId);
              const isHeartMessage = message.content === '❤️';
              if (isHeartMessage) {
                return (
                  <AnimatedHeart
                    key={msgId}
                    message={message}
                    isSender={isSender}
                    senderName={user?.name}
                    receiverName={receiverName}
                    onSeen={() => handleMessageSeen(message)}
                    isDarkMode={isDarkMode}
                  />
                );
              }
              return (
                <Message
                  key={msgId}
                  message={message}
                  isSender={isSender}
                  senderName={user?.name}
                  receiverName={receiverName}
                  onSeen={() => handleMessageSeen(message)}
                  isDarkMode={isDarkMode}
                />
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t relative ${
        isDarkMode
          ? 'bg-gray-900 border-gray-700'
          : 'bg-white/95 backdrop-blur-sm border-gray-200'
      }`} style={{ zIndex: 9999 }}>
        {error && (
          <div className={`mb-3 p-2 border rounded-lg ${
            isDarkMode
              ? 'bg-red-900/20 border-red-800'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`text-sm ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}>{error}</p>
          </div>
        )}

        <div className="flex items-center gap-2 relative">
          {/* Emoji Button */}
          <div className="relative">
            <button
              ref={emojiButtonRef}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              type="button"
              className={`p-3 rounded-full transition-all ${
                isDarkMode
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-yellow-400'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-yellow-500'
              } ${showEmojiPicker ? (isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-yellow-500') : ''}`}
              disabled={!receiverId || sending}
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <EmojiPicker
                onSelectEmoji={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
                isDarkMode={isDarkMode}
                emojiButtonRef={emojiButtonRef}
              />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            className={`flex-1 px-4 py-3 border-0 rounded-full focus:outline-none focus:ring-2 transition-all shadow-inner ${
              isDarkMode
                ? 'bg-gray-800 text-gray-100 focus:ring-blue-500 placeholder-gray-500'
                : 'bg-gray-50 focus:bg-white focus:ring-sky-500 placeholder-gray-400'
            }`}
            placeholder="Type your message..."
            disabled={!receiverId || sending}
          />
          <button
            onClick={handleSendMessage}
            type="button"
            className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-medium"
            disabled={!content.trim() || !receiverId || sending}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;