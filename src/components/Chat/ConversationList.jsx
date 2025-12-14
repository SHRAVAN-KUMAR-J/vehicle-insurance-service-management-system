import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';

function ConversationList({ onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
    fetchAvailableUsers();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chat/conversations');
      setConversations(res.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const res = await api.get('/chat/available-users');
      setAvailableUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch available users:', err);
    }
  };

  const handleSelect = (conversation) => {
    onSelectConversation(conversation);
    navigate('/chat', {
      state: {
        conversationId: conversation.conversationId,
        receiverId: conversation.participant._id,
        receiverName: conversation.participant.name,
        receiverRole: conversation.participant.role
      }
    });
  };

  const handleStartNewChat = async (selectedUser) => {
    try {
      setLoading(true);
      const res = await api.get(`/chat/conversation/${selectedUser._id}`);
      const conversation = res.data.data;
     
      const formattedConversation = {
        id: conversation._id,
        conversationId: conversation.conversationId,
        participant: selectedUser,
        lastMessage: conversation.lastMessage || null,
        lastMessageAt: conversation.lastMessageAt,
        unreadCount: 0
      };

      onSelectConversation(formattedConversation);
      navigate('/chat', {
        state: {
          conversationId: conversation.conversationId,
          receiverId: selectedUser._id,
          receiverName: selectedUser.name,
          receiverRole: selectedUser.role
        }
      });
     
      setShowUserList(false);
      fetchConversations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Conversations</h3>
        <button
          onClick={() => setShowUserList(!showUserList)}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          {showUserList ? 'Hide Users' : 'New Chat'}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      {showUserList && (
        <div className="mb-4 border rounded p-3 bg-gray-50 max-h-60 overflow-y-auto">
          <h4 className="font-semibold mb-2 text-sm">
            {user?.role === 'customer' ? 'Staff Members' : 'Users'}
          </h4>
          {availableUsers.length === 0 ? (
            <p className="text-gray-500 text-sm">No users available</p>
          ) : (
            <div className="space-y-2">
              {availableUsers.map((availableUser) => (
                <div
                  key={availableUser._id}
                  onClick={() => handleStartNewChat(availableUser)}
                  className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition"
                >
                  {availableUser.profileImage?.url ? (
                    <img
                      src={availableUser.profileImage.url}
                      alt={availableUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {availableUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{availableUser.name}</p>
                    <p className="text-xs text-gray-500">{availableUser.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {loading && conversations.length === 0 ? (
          <p className="text-gray-500 text-sm">Loading conversations...</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500 text-sm">No conversations yet. Start a new chat!</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelect(conv)}
              className="border p-3 rounded cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2 mb-2">
                {conv.participant?.profileImage?.url ? (
                  <img
                    src={conv.participant.profileImage.url}
                    alt={conv.participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {conv.participant?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold">{conv.participant?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage?.content || 'No messages'}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              {conv.lastMessageAt && (
                <p className="text-xs text-gray-500">{formatDate(conv.lastMessageAt)}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ConversationList;