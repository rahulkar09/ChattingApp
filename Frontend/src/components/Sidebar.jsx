import React from 'react'
import assets, { userDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'


const Sidebar = ({selectedUser, setSelectedUser}) => {
    const navigate = useNavigate()
    
    return (
        <div className='h-full bg-white p-4 flex flex-col'>
            <div className='flex items-center justify-between mb-6'>
                <img src={assets.logo} alt="" className='max-w-40'/>
                
                <div className='relative group'>
                    <img 
                        src={assets.settings_icon} 
                        alt="" 
                        className='w-6 h-6 cursor-pointer hover:opacity-70 transition-all'
                    />
                    
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10'>
                        
                        <p 
                            onClick={() => navigate('/profile')}
                            className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm rounded-t-lg transition-colors'
                        >
                            Edit Profile
                        </p>
                        <p className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm rounded-b-lg transition-colors'>
                            Logout
                        </p>
                    </div>
                </div>
            </div>


            <div className='relative flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4'>
                <img src={assets.search_icon} alt="" className='w-5 h-5 mr-2'/>
                <input 
                    type="text" 
                    placeholder='Search User' 
                    className='flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500'
                />
            </div>


            <div className='flex-1 overflow-y-auto'>
                {userDummyData.map((user, index) => (
                    <div 
                        key={user.id} 
                        onClick={() => setSelectedUser(user)} 
                        className={`cursor-pointer flex items-center gap-3 mb-2 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                            selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                    >
                        <div className='relative'>
                            <img 
                                src={user?.profilePic || assets.avatar_icon} 
                                alt="" 
                                className='w-12 h-12 rounded-full object-cover'
                            />
                            {index < 3 && (
                                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></span>
                            )}
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='font-semibold text-gray-800 text-sm truncate'>{user.fullName}</p>
                            {index < 3 ? (
                                <span className='text-xs text-green-600 font-medium'>Online</span>
                            ) : (
                                <span className='text-xs text-gray-500'>Offline</span>
                            )}
                        </div>
                        {index > 2 && (
                            <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full shrink-0'>
                                {index}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}


export default Sidebar
