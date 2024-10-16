import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';  
import moment from 'moment';  

const socket = io('http://localhost:4000'); // Your server URL

const Chat = ({ courseId, role }) => {
  const instructorInfo = useSelector((state) => state.instructorauth.instructorInfo);
  const userInfo = useSelector((state) => state.auth.userInfo);

  let predefinedUserName = 'JohnDo'; // Predefined user name
  const predefinedRoomName = courseId; // Predefined room based on courseId
  let predefinedUserId = 'user123'; // Unique userId for this user (this could be dynamically assigned)

  if (role === "instructor") {
    predefinedUserName = instructorInfo.name + " Instructor";
    predefinedUserId = instructorInfo._id;
  } else if (role === "student") {
    predefinedUserName = userInfo.name;
    predefinedUserId = userInfo._id;
  }

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to show/hide emoji picker

  useEffect(() => {
    // Automatically join the predefined room when the component mounts
    socket.emit('joinRoom', predefinedRoomName);

    // Listen for messages from the server
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [predefinedRoomName]);

  // Send a message to the server and specify the room
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message); // Debugging: Check the message content before sending
      const messageData = {
        user: predefinedUserName, // Use predefined user name
        userId: predefinedUserId, // Use unique userId
        text: message,  // The actual message with emoji included
        room: predefinedRoomName, // Use predefined room
        timestamp: moment().format('h:mm A'), // Add a timestamp using moment.js
      };
      socket.emit('sendMessage', messageData); // Send the message to the server
      setMessage(''); // Clear the input field
    } else {
      console.log('Message is empty or undefined!'); // If message is empty, log this for debugging
    }
  };

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Correctly append the emoji to the message state
  };

  return (
    <div className="chat-container container mt-4 p-3 border rounded bg-light">
      <h4 className="text-center mb-4">Chat Box</h4>

      <div className="messages bg-white p-3 rounded mb-3" style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex flex-column ${msg.userId === predefinedUserId ? 'align-items-end' : 'align-items-start'} my-2`}
          >
            <span className="small text-muted">{msg.user} <span className="small text-muted">{msg.timestamp}</span></span>
            <div className={`message p-2 rounded ${msg.userId === predefinedUserId ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Button to toggle emoji picker */}
        <button type="button" className="btn btn-light me-2" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          😊
        </button>

        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>

      {/* Emoji picker component */}

      
      {showEmojiPicker && (
        <div className="mt-2">
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default Chat;
