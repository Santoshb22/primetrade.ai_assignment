import React from 'react'
import { useNavigate } from 'react-router';

const Sidebar = ({userName, handleLogout}) => {
    const navigate = useNavigate();
  return (
     <nav className="block md:hidden absolute z-50 top-16 right-0 w-1/2 bg-indigo-100 p-4 shadow-md flex flex-col items-start h-[100vh] gap-4">
        <button
        onClick={() => navigate("/dashboard")}
        className="text-indigo-700 font-medium hover:underline"
        >
        Dashboard
        </button>

        <div className="flex gap-2">
        <button
        className="text-lg font-medium text-indigo-800 hover:underline"
        onClick={() => navigate("/profile")}
        >
        {userName}
        </button>
        
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7 text-indigo-700"
        >
        <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
        />
        </svg>
        </div>

        <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-800 text-white rounded-md hover:bg-red-600 transition"
        >
        Logout
        </button>
    </nav>
  )
}

export default Sidebar