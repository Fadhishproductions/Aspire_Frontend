import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { useDeleteNotificationMutation, useGetNoficationsQuery } from '../slices/userApiSlice';

function NotificationBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notifications, setNotifications] = useState([]);

  const { data: newNotifications, error, isLoading, refetch } = useGetNoficationsQuery();
  const [deleteNotification] = useDeleteNotificationMutation()

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);
  
  useEffect(() => {
    if (newNotifications && Array.isArray(newNotifications)) {
      // Transform notifications to extract courseName and instructorName
      const formattedNotifications = newNotifications.map((notification) => ({
        _id:notification._id,
        title: notification.title,
        content: notification.content,
        createdAt: notification.createdAt,
        courseName: notification?.courseName  || 'Unknown Course', // Safely access the course name
        instructorName: notification.instructorName || 'Unknown Instructor', // Safely access the instructor name
      }));
      setNotifications(formattedNotifications);
    } else if (error) {
      setErrorMessage(
        error?.data?.message || 'An error occurred while fetching notifications.'
      );
      setNotifications([]);
    }
  }, [newNotifications, isOpen, error]);

  const timeAgo = (createdAt) => {
    const timeDiff = Date.now() - new Date(createdAt).getTime();
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const handleDelete = async(notificationId) => {
    const originalNotifications = [...notifications];
     setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification._id !== notificationId)
    );
    try {
      // Attempt to delete the notification on the server
      await deleteNotification({notificationId});
    } catch (error) {
      // Revert to the original notifications if the API call fails
      setErrorMessage('Failed to delete notification.');
      setNotifications(originalNotifications);
    }
  }; 

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const scrollbarStyles = `
  .scrollable {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }
  .scrollable::-webkit-scrollbar {
    width: 4px;  
  }
  .scrollable::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollable::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
    border: 2px solid transparent;
    transition: background 0.3s ease;
  }
  .scrollable::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  .scrollable:focus, .scrollable:hover {
    scrollbar-color: #888 #f8f9fa;
  }
  .scrollable:focus::-webkit-scrollbar-track, .scrollable:hover::-webkit-scrollbar-track {
    background: #f8f9fa;
  }
  .scrollable:focus::-webkit-scrollbar-thumb, .scrollable:hover::-webkit-scrollbar-thumb {
    background: #888;
    border: 2px solid #f8f9fa;
  }
  .scrollable:focus::-webkit-scrollbar-thumb:hover, .scrollable:hover::-webkit-scrollbar-thumb:hover {
    background: #555;
  }`
;
  return (
    <div
      className="position-fixed bg-light border rounded shadow-sm p-3"
      style={{
        top: '90px',
        right: '10px',
        width: '320px',
        zIndex: 1000,
        maxHeight: '500px',
        overflow: 'hidden',
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center position-relative"
        onClick={toggleOpen}
        style={{ cursor: 'pointer' }}
      >
        <h5 className="m-0" style={{ color: '#007bff' }}>Notification Box</h5>

        {notifications.length > 0 && (
          <span
            className="position-absolute bg-danger rounded-circle"
            style={{
              top: '-12px',
              right: '-12px',
              width: '18px',
              height: '18px',
              border: '2px solid white',
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
            }}
          >
            {notifications.length}
          </span>
        )}

        <span className="ml-2">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      <ul
        className={`scrollable list-unstyled mt-2 ${isOpen ? 'd-block' : 'd-none'}`}
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          marginTop: isOpen ? '10px' : '0',
        }}
        >
          {isLoading && <p>Loading...</p>}
        {errorMessage ? (
          <div className="alert alert-danger text-center">{errorMessage}</div>
        ) : notifications.length === 0 ? (
          <div className="alert alert-info text-center">
            No notifications available.
          </div>
        ) : (
          notifications.map((notification, index) => (
            <li
              key={index}
              className="bg-white border mb-2 p-3 rounded d-flex flex-column position-relative"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #007bff',
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="font-weight-bold" style={{ color: '#343a40' }}>
                  {notification.title}
                </span>
                <FaTimes
                  className="text-muted"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(notification._id)}
                />
              </div>
              <p className="mb-2" style={{ color: '#495057' }}>{notification.content}</p>
              <div className="text-muted mb-2" style={{ fontSize: '13px' }}>
                <span><strong>Course:</strong> {notification.courseName}</span><br />
                <span><strong>Instructor:</strong> {notification.instructorName}</span>
              </div>
              <small className="text-secondary">
                {timeAgo(notification.createdAt)}
              </small>
            </li>
          ))
        )}
      </ul>
      <style>{scrollbarStyles}</style>
    </div>
  );
}

export default NotificationBox;
