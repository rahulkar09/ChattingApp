import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { users, selectedUser, setSelectedUser, unseenMessages, getUsers } = useContext(ChatContext);
  const { authuser, onlineUsers, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const isOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  // Generate initials from fullname
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate consistent color based on name
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

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col bg-white h-screen">
      {/* Sidebar Header with User Profile */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800">Messages</h3>
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="focus:outline-none hover:opacity-80 transition-opacity"
            >
              {authuser?.profilePic ? (
                <img 
                  src={authuser.profilePic} 
                  alt={authuser.fullname}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200 ${getAvatarColor(authuser?.fullname || '')}`}>
                  {getInitials(authuser?.fullname || '')}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                ></div>
                
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {authuser?.fullname}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {authuser?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={handleEditProfile}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <span className="text-lg">✏️</span>
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <span className="text-lg">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Users List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {users && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className={`flex items-center p-4 cursor-pointer transition-all duration-200 border-l-4 ${
                selectedUser?._id === user._id 
                  ? 'bg-blue-50 border-blue-500' 
                  : 'border-transparent hover:bg-gray-50'
              }`}
              onClick={() => handleUserSelect(user)}
            >
              {/* User Avatar with Online Status */}
              <div className="relative mr-3 flex-shrink-0">
                {user.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt={user.fullname}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(user.fullname)}`}>
                    {getInitials(user.fullname)}
                  </div>
                )}
                {isOnline(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {user.fullname}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
              
              {/* Unseen Messages Badge */}
              {unseenMessages[user._id] > 0 && (
                <span className="ml-2 px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full flex-shrink-0">
                  {unseenMessages[user._id]}
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">No users available</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
