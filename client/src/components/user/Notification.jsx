import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { notifications } = useSelector(state => state.user);
  
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  
  const handleMarkAsRead = () => {
    if (unreadCount > 0) {
      dispatch(markNotificationsAsRead());
    }
  };
  
  return (
    <div className="dropdown dropdown-end">
      <label 
        tabIndex={0} 
        className="btn btn-ghost btn-circle" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          {unreadCount > 0 && (
            <span className="badge badge-xs badge-primary indicator-item">{unreadCount}</span>
          )}
        </div>
      </label>
      
      <div 
        tabIndex={0} 
        className={`card dropdown-content card-compact w-64 bg-base-100 shadow z-[1] ${isOpen ? '' : 'hidden'}`}
      >
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="btn btn-xs btn-ghost"
                onClick={handleMarkAsRead}
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-60 overflow-auto">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-2 border-b ${notification.read ? '' : 'bg-base-200'}`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-base-content text-opacity-60">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-center py-4">No notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
