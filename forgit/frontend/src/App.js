import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Editor from './pages/Editor';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ViewSite from './pages/ViewSite';
import About from './pages/About';
import Templates from './pages/Templates';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/editor" element={<Editor />} /> 
          <Route path="/site/:id" element={<ViewSite />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;