import React, { useContext, useEffect, useState, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const { messages, selectedUser, getMessages, sendMessage } = useContext(ChatContext);
  const { authuser } = useContext(AuthContext);
  const [messageText, setMessageText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() && !imagePreview) {
      toast.error('Please enter a message or select an image');
      return;
    }

    const messageData = {
      text: messageText.trim(),
      image: imagePreview || null
    };

    await sendMessage(messageData);
    setMessageText('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 h-full">
        <div className="text-center">
          <div className="mb-4 text-8xl">💬</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            Welcome to Chat App
          </h3>
          <p className="text-gray-500">
            Select a user from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {/* Chat Header */}
      <div className="h-[72px] min-h-[72px] bg-white border-b border-gray-200 px-6 flex items-center flex-shrink-0">
        <div className="flex items-center">
          {selectedUser.profilePic ? (
            <img 
              src={selectedUser.profilePic} 
              alt={selectedUser.fullname}
              className="w-11 h-11 rounded-full object-cover mr-3 flex-shrink-0"
            />
          ) : (
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold mr-3 text-sm flex-shrink-0 ${getAvatarColor(selectedUser.fullname)}`}>
              {getInitials(selectedUser.fullname)}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-base font-semibold text-gray-800 truncate">
              {selectedUser.fullname}
            </h4>
            <p className="text-sm text-gray-500 truncate">
              {selectedUser.bio || 'No bio available'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => {
              // Convert IDs to strings for reliable comparison
              const messageSenderId = String(message.senderId?._id || message.senderId);
              const currentUserId = String(authuser?._id);
              const isSentByMe = messageSenderId === currentUserId;

              return (
                <div
                  key={message._id}
                  className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 break-words ${
                      isSentByMe
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm shadow-md'
                    }`}
                  >
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="attachment" 
                        className="max-w-full rounded-lg mb-2"
                      />
                    )}
                    
                    {message.text && (
                      <p className="text-sm">{message.text}</p>
                    )}
                    
                    <div className={`flex items-center justify-end mt-1 text-xs ${
                      isSentByMe ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      <span>{formatTime(message.createdAt)}</span>
                      {isSentByMe && (
                        <span className="ml-1">
                          {message.seen ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="min-h-[80px] px-6 py-3 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="preview" 
              className="max-w-[200px] max-h-[200px] rounded-lg"
            />
            <button 
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
              onClick={() => {
                setImagePreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <form 
        className="min-h-[80px] bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0"
        onSubmit={handleSendMessage}
      >
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <button
            type="button"
            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors text-xl"
            onClick={() => fileInputRef.current?.click()}
          >
            📎
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button 
            type="submit"
            className="flex-shrink-0 px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!messageText.trim() && !imagePreview}
          >
            Send ➤
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatContainer;
