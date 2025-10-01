import React from 'react'
import { Route, Routes } from 'react-router'
import Auth from './page/Auth'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
      </Routes>
    </>
  )
}

export default App