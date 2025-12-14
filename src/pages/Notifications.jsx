import React, { useEffect, useState } from 'react';
import { formatDate } from '../utils/formatDate';
import { useNotifications } from '../hooks/useNotifications';

const NotificationsPage = () => {
  const {
    notifications,
    markAsSeen,
    markAllAsSeen,
    fetchNotifications,
    loading,
    error,
    unreadCount
  } = useNotifications();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
    fetchNotifications({ page: 1, limit })
      .then((data) => data?.pages && setTotalPages(data.pages))
      .catch(err => console.error('Failed to fetch notifications:', err));
  }, [fetchNotifications, limit]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    try {
      const data = await fetchNotifications({ page: nextPage, limit });
      data?.pages && setTotalPages(data.pages);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to load more notifications:', err);
    }
  };

  const handleMarkAllAsSeen = async () => {
    try {
      await markAllAsSeen();
    } catch (err) {
      console.error('Failed to mark all as seen:', err);
    }
  };

  const getNotificationIcon = (type, metadata) => {
    if (type === 'reminder') {
      if (metadata?.postExpiry || metadata?.reminderDays === -1) return '⚠️';
      else if (metadata?.postStart || metadata?.reminderDays === 365) return '📅';
      return '🔔';
    }
    switch (type) {
      case 'approval': return '✅';
      case 'message': return '💬';
      case 'update': return '📢';
      default: return '📋';
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading notifications: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsSeen}
            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition font-semibold shadow-sm"
          >
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>
      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-600 text-lg">No notifications available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`rounded-lg p-5 transition-all duration-300 shadow-sm hover:shadow-md border ${
                !notification.isSeen
                  ? 'bg-green-50 border-green-400'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getNotificationIcon(notification.type, notification.metadata)}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                    {!notification.isSeen && (
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{notification.message}</p>
                  {notification.metadata && (
                    <div className="bg-gray-50 rounded-md p-3 mb-3 text-sm space-y-1">
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
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{formatDate(notification.createdAt)}</span>
                    {notification.isSeen && notification.seenAt && (
                      <span className="text-xs text-gray-400">
                        Read: {formatDate(notification.seenAt)}
                      </span>
                    )}
                  </div>
                </div>
                {!notification.isSeen && (
                  <button
                    onClick={() => markAsSeen(notification._id)}
                    className="ml-4 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
          {page < totalPages && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading more...
                  </span>
                ) : (
                  `Load More (Page ${page} of ${totalPages})`
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;