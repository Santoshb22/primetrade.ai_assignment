import React from 'react';
import { Route, Routes, Navigate } from 'react-router';
import Auth from './page/Auth';
import Dashboard from './page/Dashboard';
import Header from './component/Header';

const App = () => {
  const authStatus = JSON.parse(localStorage.getItem("userState"))?.authStatus;

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={authStatus ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard" element={authStatus ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
