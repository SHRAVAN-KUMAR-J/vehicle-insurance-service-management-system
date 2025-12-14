import { useState, useEffect } from 'react';
import Navbar from '../components/Common/Navbar';
import ConversationList from '../components/Chat/ConversationList';
import ChatBox from '../components/Chat/ChatBox';
import { useLocation } from 'react-router-dom';

function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const location = useLocation();

  // Extract data from location.state
  useEffect(() => {
    if (location.state) {
      const { conversationId, receiverId, receiverName, receiverRole } = location.state;
      if (conversationId || receiverId) {
        setSelectedConversation({
          conversationId,
          receiverId,
          receiverName,
          receiverRole
        });
      }
    }
  }, [location.state]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation({
      conversationId: conversation.conversationId,
      receiverId: conversation.participant._id,
      receiverName: conversation.participant.name,
      receiverRole: conversation.participant.role
    });
  };

  // Determine which conversation to display
  const activeConversation = selectedConversation || (location.state ? {
    conversationId: location.state.conversationId,
    receiverId: location.state.receiverId,
    receiverName: location.state.receiverName,
    receiverRole: location.state.receiverRole
  } : null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Chat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <ConversationList onSelectConversation={handleSelectConversation} />
          </div>
          <div className="md:col-span-2">
            {activeConversation ? (
              <ChatBox
                conversationId={activeConversation.conversationId}
                receiverId={activeConversation.receiverId}
                receiverName={activeConversation.receiverName}
                receiverRole={activeConversation.receiverRole}
              />
            ) : (
              <div className="h-[600px] border rounded-2xl shadow-xl bg-white flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg
                    className="mx-auto h-16 w-16 mb-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-lg font-medium">Select a conversation to start chatting</p>
                  <p className="text-sm text-gray-400 mt-2">Choose from your conversations or start a new chat</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;