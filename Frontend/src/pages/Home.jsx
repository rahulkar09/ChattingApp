import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import assets, { userDummyData } from '../assets/assets'


const Home = () => {
    const [selectedUser, setSelectedUser] = useState(false)
    
    return (
        <div className='flex items-center justify-center w-full h-screen sm:px-[15%] sm:py-[5%] bg-gray-100'>
            <div className='flex w-full h-full bg-white shadow-lg rounded-lg overflow-hidden'>
                {/* Left Sidebar - User list */}
                <div className='w-1/4 border-r border-gray-300'>
                    <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                </div>
                
                {/* Main Chat Container */}
                <div className='flex-1 flex flex-col'>
                    <ChatContainer selectedUser={selectedUser} />
                </div>
                
                {/* Right Sidebar - User details/info */}
                {!selectedUser && <div className='w-1/4 border-l border-gray-300'>
                    <RightSidebar selectedUser={selectedUser} />
                </div>}
            </div>


           
        </div>
    )
}


export default Home
