import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../store/userSlice";
import { useNavigate } from "react-router";
import Sidebar from "./Sidebar";

const Header = () => {
  const userName = useSelector((store) => store?.user?.userInfo?.username);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user?.token);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const authStatus = useSelector((store) => store.user?.authStatus);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_API}/logout`, {
        method: "POST",
        "Authorization": `Bearer ${token}`,
    });

      dispatch(clearUser());
      navigate("/");
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="relative flex justify-between items-center p-4 bg-indigo-100 shadow-md">
      <div
        className="flex gap-2 items-center cursor-pointer"
      >
        <h1 className="md:text-2xl font-bold text-indigo-700">PrimeTrade</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="hidden md:block w-6 h-6 text-indigo-600"
        >
          <path
            fillRule="evenodd"
            d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {
        userName && (
      <nav className="flex gap-6 hidden md:block items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-indigo-700 font-medium hover:underline"
        >
          Dashboard
        </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
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
          </div>
      </nav>
        )
      }
      <button 
      className={`block md:hidden ${!authStatus && "hidden"}`}
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {
          !isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          ) :(
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          )
        }
      </button>

      {
        isSidebarOpen && (
          <Sidebar userName = {userName} handleLogout={handleLogout}/>
        )
      }

    </header>
  );
};

export default Header;
