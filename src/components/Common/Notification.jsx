import { formatDate } from '../../utils/formatDate';
import { useNotifications } from '../../hooks/useNotifications';

function Notification({ notification }) {
  const { markAsSeen } = useNotifications();

  const handleMarkAsSeen = async () => {
    if (!notification.isSeen) {
      try {
        await markAsSeen(notification._id);
      } catch (err) {
        console.error('Failed to mark notification as seen:', err);
      }
    }
  };

  const getNotificationIcon = (type, metadata) => {
    if (type === 'reminder') {
      if (metadata?.postExpiry || metadata?.reminderDays === -1) return '⚠️';
      else if (metadata?.postStart || metadata?.reminderDays === 365) return '📅';
      return '🔔';
    }
    switch (type) {
      case 'approval':
        return '✅';
      case 'message':
        return '💬';
      case 'update':
        return '📢';
      default:
        return '📋';
    }
  };

  return (
    <div
      onClick={handleMarkAsSeen}
      className={`p-5 rounded-xl shadow-sm cursor-pointer transition-all duration-300 border
        ${!notification.isSeen
          ? 'bg-green-50 border-green-400 hover:shadow-md'
          : 'bg-white border-gray-200 hover:shadow'
        }`}
    >
      <div className="flex items-start justify-between">
        {/* Left Section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getNotificationIcon(notification.type, notification.metadata)}</span>
            <h4 className="font-semibold text-gray-800">{notification.title}</h4>
            {!notification.isSeen && (
              <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">New</span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">{notification.message}</p>
          {/* Metadata Info */}
          {notification.metadata && (
            <div className="bg-gray-50 rounded-md p-3 text-sm space-y-1">
              {notification.metadata.insuranceId && (
                <div className="text-gray-700">
                  <span className="font-semibold">Insurance Status:</span>{' '}
                  {notification.metadata.insuranceId.paymentStatus}
                </div>
              )}
              {notification.metadata.reminderDays && (
                <div className="text-gray-700">
                  <span className="font-semibold">Reminder Type:</span>{' '}
                  {notification.metadata.postStart
                    ? 'Insurance Started'
                    : notification.metadata.postExpiry
                    ? 'Insurance Expired'
                    : `${notification.metadata.reminderDays} Day Reminder`}
                </div>
              )}
              {notification.metadata.startDate && (
                <div className="text-gray-700">
                  <span className="font-semibold">Start Date:</span>{' '}
                  {formatDate(notification.metadata.startDate)}
                </div>
              )}
              {notification.metadata.expiryDate && (
                <div className="text-gray-700">
                  <span className="font-semibold">Expiry Date:</span>{' '}
                  {formatDate(notification.metadata.expiryDate)}
                </div>
              )}
              {notification.metadata.senderId && (
                <div className="text-gray-700">
                  <span className="font-semibold">From:</span>{' '}
                  {notification.metadata.senderId.name || notification.metadata.senderId.email}
                </div>
              )}
            </div>
          )}
          <span className="text-xs text-gray-500 block mt-2">
            {formatDate(notification.createdAt)}
          </span>
        </div>
        {/* Right Side Button */}
        {!notification.isSeen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMarkAsSeen();
            }}
            className="ml-4 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-green-700 transition"
          >
            Mark Read
          </button>
        )}
      </div>
    </div>
  );
}

export default Notification;