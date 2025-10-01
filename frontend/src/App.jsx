import React from 'react'
import { Route, Routes } from 'react-router'
import Auth from './page/Auth'
import Dashboard from './page/Dashboard'
import Header from './component/Header'

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App