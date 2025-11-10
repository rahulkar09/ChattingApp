import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import io from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [authuser, setAuthuser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    

    // Check auth user function
    const checkAuthUser = async () => {
        try {
            const { data } = await axios.get(`/api/users/checkAuth`);
            if (data.success) {
                setAuthuser(data.user);
                connectSocket(data.user);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };


     // login function to handle user authentication and socket connection
     const login = async (state , credentials) => {
        try{
            const { data } = await axios.post(`/api/users/${state}`, credentials);
            if(data.success){
                setAuthuser(data.data.userData);
                connectSocket(data.data.userData);
                axios.defaults.headers.common["token"] = data.data.token;
                setToken(data.data.token);
                localStorage.setItem("token" , data.data.token);
                toast.success(data.message);
            }
            else{
                toast.error(data.message);
            }

        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    //logout function to clear user data and disconnect socket
    const logout = async() =>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthuser(null);
        setOnlineUsers([]);
        disconnectSocket();
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully");
    }


    //update profile function to update user prfile
    const updateProfile = async (body) => {
        try{
            const {data} = await axios.patch('/api/users/updateProfile' , body);
            if(data.success){
                setAuthuser(data.updatedUser);
                toast.success(data.message);
            }
            

        }
        catch(error){
            toast.error(error.response?.data?.message || error.message);

        }
    }


    // Connect socket function to handle socket connection
    const connectSocket = (userData) => {
        // Fixed: Changed OR to AND
        if (!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        });

        // Fixed: connect() not connet()
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (usersIds) => {
            setOnlineUsers(usersIds);
        });
    };

    // Disconnect socket function
    const disconnectSocket = () => {
        if (socket?.connected) {
            socket.disconnect();
            setSocket(null);
        }
    };

    // Check auth when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
            checkAuthUser();
        } else {
            setAuthuser(null);
            disconnectSocket();
        }
    }, [token]);

    // Cleanup socket on unmount
    useEffect(() => {
        return () => {
            disconnectSocket();
        };
    }, []);

    const value = {
        backendUrl,
        token,
        setToken,
        authuser,
        setAuthuser,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket,
        axios,
        login,
        logout,
        updateProfile,
        checkAuthUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
