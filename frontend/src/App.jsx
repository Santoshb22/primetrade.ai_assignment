import React from 'react';
import { Route, Routes, Navigate } from 'react-router';
import Auth from './page/Auth';
import Dashboard from './page/Dashboard';
import Header from './component/Header/Header';
import Profile from './page/Profile';
import { useSelector } from 'react-redux';

const App = () => {
  const authStatus = useSelector((state) => state.user?.authStatus);
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={authStatus ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard" element={authStatus ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={authStatus ? <Profile /> : <Navigate to="/" />} />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </>
  );
};

export default App;
