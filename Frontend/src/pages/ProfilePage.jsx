import React, { useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  
  // Using the first user from userDummyData as the logged-in user
  const [userData, setUserData] = useState({
    fullName: 'Alison Martin',
    email: 'test1@greatstack.dev',
    profilePic: assets.avatar_icon,
    bio: 'Hi Everyone, I am Using QuickChat'
  })

  const [editData, setEditData] = useState(userData)

  const handleSave = () => {
    setUserData(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(userData)
    setIsEditing(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditData({...editData, profilePic: reader.result})
      }
      reader.readAsDataURL(file)
    }
  }

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
          
          {/* Profile Content */}
          <div className='relative px-6 pb-8'>
            {/* Avatar Section */}
            <div className='flex justify-center -mt-16 mb-6'>
              <div className='relative'>
                <img 
                  src={editData.profilePic || assets.avatar_icon} 
                  alt="Profile" 
                  className='w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-white'
                />
                {isEditing && (
                  <label className='absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg cursor-pointer transition-colors'>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className='hidden'
                    />
                    <img src={assets.gallery_icon} alt="" className='w-5 h-5' />
                  </label>
                )}
              </div>
            </div>

            {/* Edit/Save/Cancel Buttons */}
            <div className='flex justify-end mb-6'>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-md'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className='flex gap-3'>
                  <button 
                    onClick={handleCancel}
                    className='px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors'
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
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
                    value={editData.fullName}
                    onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                ) : (
                  <p className='text-lg font-semibold text-gray-800 bg-gray-50 px-4 py-3 rounded-lg'>
                    {userData.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 mb-2'>
                  Email Address
                </label>
                  <p className='text-lg text-gray-700 bg-gray-50 px-4 py-3 rounded-lg'>
                    {userData.email}
                  </p>
                
              </div>

              {/* Bio - Full Width */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-semibold text-gray-600 mb-2'>
                  Bio
                </label>
                {isEditing ? (
                  <textarea 
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    rows="4"
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
                    placeholder='Tell us about yourself...'
                  />
                ) : (
                  <p className='text-lg text-gray-700 bg-gray-50 px-4 py-3 rounded-lg'>
                    {userData.bio}
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
