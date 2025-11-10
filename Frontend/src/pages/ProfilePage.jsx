import React, { useState, useContext } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { authuser , updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    fullName: authuser?.fullname || 'Alison Martin',
    email: authuser?.email || 'test1@greatstack.dev',
    bio: authuser?.bio || 'Hi Everyone, I am Using QuickChat',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Assuming updateProfile is from context or imported API helper
    const updatedData = {
      fullName: editData.fullName,
      bio: editData.bio
    };

    // Call the update API (replace with your actual function or context)
    await updateProfile(updatedData);

    // Close editing mode
    setIsEditing(false);

    // Optionally update global auth user state here if not handled inside updateProfile
    // setAuthuser(...)

    toast.success("Profile updated successfully");
  } catch (error) {
    toast.error("Failed to update profile");
    console.error(error);
  }
};


  const handleCancel = () => {
    setEditData({
      fullName: authuser?.fullname || 'Alison Martin',
      email: authuser?.email || 'test1@greatstack.dev',
      bio: authuser?.bio || 'Hi Everyone, I am Using QuickChat',
    });
    setIsEditing(false);
  };

  return (
    <div className='min-h-screen bg-gray-100 py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors'
        >
          <img src={assets.arrow_icon} alt="" className='w-5 h-5 rotate-180' />
          <span className='font-medium'>Back to Chat</span>
        </button>

        {/* Profile Card */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          {/* Cover Image */}
          <div className='h-32 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500'></div>

          {/* Profile Content form */}
          <form onSubmit={handleSubmit} className='relative px-6 pb-8'>

            {/* Avatar Section */}
            <div className='flex justify-center -mt-16 mb-6'>
              <img
                src={assets.avatar_icon}
                alt="Profile"
                className='w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-white'
              />
            </div>

            {/* Edit/Save/Cancel Buttons */}
            <div className='flex justify-end mb-6'>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-md'
                >
                  Edit Profile
                </button>
              ) : (
                <div className='flex gap-3'>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className='px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className='px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md'
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Profile Information Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Full Name */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 mb-2'>
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                ) : (
                  <p className='text-lg font-semibold text-gray-800 bg-gray-50 px-4 py-3 rounded-lg'>
                    {editData.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 mb-2'>
                  Email Address
                </label>
                <p className='text-lg text-gray-700 bg-gray-50 px-4 py-3 rounded-lg'>
                  {editData.email}
                </p>
              </div>

              {/* Bio - Full Width */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-semibold text-gray-600 mb-2'>
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
                    placeholder='Tell us about yourself...'
                  />
                ) : (
                  <p className='text-lg text-gray-700 bg-gray-50 px-4 py-3 rounded-lg'>
                    {editData.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className='mt-8 pt-6 border-t border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>Account Information</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-gray-50 px-4 py-3 rounded-lg'>
                  <p className='text-sm text-gray-600'>Account Status</p>
                  <p className='text-lg font-semibold text-green-600'>Active</p>
                </div>
                <div className='bg-gray-50 px-4 py-3 rounded-lg'>
                  <p className='text-sm text-gray-600'>Member Since</p>
                  <p className='text-lg font-semibold text-gray-800'>April 2025</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
