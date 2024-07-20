import React from 'react'
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./components/Home";
import Form from './components/login_forms/form';
import Statistics from './components/statistics/statistics';
// import Form from './components/login_forms/form';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/home" element={<Home />} />
          <Route path="/statistics" element={<Statistics />} />
          {/* <Route path="/expense" element={<ExpenseForm />} /> */}

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
