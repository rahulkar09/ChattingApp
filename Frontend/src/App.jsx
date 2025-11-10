import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from './context/AuthContext'

const App = () => {
  const {authuser , token} = useContext(AuthContext);
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={authuser ? <Home /> : <Navigate to='/login'/>} />
        <Route path="/login" element={!authuser ? <Login /> : <Navigate to='/'/>} />
        <Route path="/profile" element={token ? <ProfilePage/> : <Login/>} />
      </Routes>
    </div>
  )
}

export default App
