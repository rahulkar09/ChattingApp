import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast'

const App = () => {
  return (
    <div >
      <Toaster>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      </Toaster>
      
    </div>
  )
}

export default App
