import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'


const Login = () => {
    const [currentState, setCurrentState] = useState("Sign up")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {login} = useContext(AuthContext);

    const onSubmitHandler = (e) => {
        e.preventDefault()
        
        console.log({ fullName, email, password, currentState })
        const credentials = currentState === "Sign up" ? {fullname: fullName , email, password} : {email, password};
        login(currentState === "Sign up" ? "signup" : "login" , credentials);

    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4'>
            <div className='bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md'>
                {/* Logo */}
                <div className='flex justify-center mb-8'>
                    <img src={assets.logo_big} alt="Logo" className='w-40 h-auto'/>
                </div>

                <form onSubmit={onSubmitHandler} className='space-y-5'>
                    {/* Header */}
                    <h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>
                        {currentState}
                    </h2>

                    {/* Full Name Input - Only for Sign up */}
                    {currentState === "Sign up" && (
                        <div>
                            <input 
                                type="text" 
                                placeholder='Full Name' 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400'
                            />
                        </div>
                    )}

                    {/* Email Input */}
                    <div>
                        <input 
                            type="email" 
                            placeholder='Email' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400'
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <input 
                            type="password" 
                            placeholder='Password' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400'
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type='submit'
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg'
                    >
                        {currentState === "Sign up" ? "Create Account" : "Login"}
                    </button>

                    {/* Toggle between Login and Sign up */}
                    <div className='text-center mt-6'>
                        {currentState === "Sign up" ? (
                            <p className='text-gray-600 text-sm'>
                                Already have an account?{' '}
                                <span 
                                    onClick={() => setCurrentState("Login")}
                                    className='text-blue-600 font-semibold cursor-pointer hover:underline'
                                >
                                    Login here
                                </span>
                            </p>
                        ) : (
                            <p className='text-gray-600 text-sm'>
                                Don't have an account?{' '}
                                <span 
                                    onClick={() => setCurrentState("Sign up")}
                                    className='text-blue-600 font-semibold cursor-pointer hover:underline'
                                >
                                    Sign up here
                                </span>
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}


export default Login
