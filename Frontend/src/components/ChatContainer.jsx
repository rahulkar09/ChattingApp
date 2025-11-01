import React from 'react'
import assets, { messagesDummyData } from '../assets/assets'


const ChatContainer = ({selectedUser, setSelectedUser}) => {
  return selectedUser ? (
    <div className='h-full flex flex-col'>
      {/* Chat Header */}
      <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white'>
        <div className='flex items-center gap-3'>
          <img 
            src={selectedUser?.profilePic || assets.profile_martin} 
            alt="" 
            className='w-10 h-10 rounded-full object-cover'
          />
          <div>
            <p className='font-semibold text-gray-800 text-sm'>
              {selectedUser?.fullName || 'Martin Johnson'}
            </p>
            <span className='text-xs text-green-600 font-medium'>Online</span>
          </div>
        </div>
        
        <div className='flex items-center gap-3'>
          <img 
            onClick={() => setSelectedUser(null)} 
            src={assets.arrow_icon} 
            alt="" 
            className='w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity md:hidden' 
          />
          <img 
            src={assets.help_icon} 
            alt="" 
            className='w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity' 
          />
        </div>
      </div>


      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto bg-gray-50 p-6'>
        <div className='space-y-4'>
          {messagesDummyData.map((msg, index) => (
            <div 
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.image ? (
                  <img 
                    src={msg.image || assets.pic1} 
                    alt="" 
                    className='max-w-xs rounded-lg shadow-md'
                  />
                ) : (
                  <div className={`px-4 py-2 rounded-2xl shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-bl-none'
                  }`}>
                    <p className='text-sm'>{msg.text}</p>
                  </div>
                )}
                <p className={`text-xs text-gray-500 mt-1 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {msg.timestamp || '10:30 AM'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Message Input Area */}
      <div className='px-6 py-4 bg-white border-t border-gray-200'>
        <div className='flex items-center gap-3'>
          <input 
            type="text" 
            placeholder='Type a message...' 
            className='flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
          />
          <button className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors'>
            Send
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className='h-full flex flex-col items-center justify-center bg-gray-50 px-6'>
      <img 
        src={assets.logo_icon} 
        alt="" 
        className='w-20 h-20 mb-6 opacity-80'
      />
      <p className='text-gray-500 text-lg font-medium text-center'>
        Chat anytime, anywhere!
      </p>
      <p className='text-gray-400 text-sm text-center mt-2'>
        Select a conversation to start messaging
      </p>
    </div>
  )
}


export default ChatContainer
