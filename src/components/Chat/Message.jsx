import { useEffect, useRef } from 'react';
import { formatDate } from '../../utils/formatDate';

function Message({ message, isSender, onSeen }) {
  const hasMarkedSeen = useRef(false);

  useEffect(() => {
    // Only mark as seen for incoming messages to current user
    if (!isSender && !message.seen && !hasMarkedSeen.current) {
      hasMarkedSeen.current = true;
      try {
        onSeen();
      } catch (err) {
        // swallow to avoid breaking UI
        console.error('onSeen error:', err);
      }
    }
  }, [message, isSender, onSeen]);

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`p-3 rounded-lg max-w-xs shadow-sm break-words ${
          isSender
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-black rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className="flex items-center justify-between mt-1 gap-2">
          <p className={`text-xs ${isSender ? 'text-blue-500' : 'text-black'}`}>
            {formatDate(message.createdAt)}
          </p>
          {isSender && message.seen && (
            <span className="text-xs text-blue-100">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;