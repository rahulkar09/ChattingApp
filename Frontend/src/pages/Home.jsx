import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';

const Home = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden fixed inset-0">
      <Sidebar />
      <ChatContainer />
    </div>
  );
};

export default Home;
