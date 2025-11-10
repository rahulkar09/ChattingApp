import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { ChatProvider } from './context/ChatContext.jsx'


createRoot(document.getElementById('root')).render(
   <BrowserRouter>
   <AuthProvider>
      <ChatProvider>
          <App/>
      </ChatProvider>
   </AuthProvider>
   </BrowserRouter>,
)
