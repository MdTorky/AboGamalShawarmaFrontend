import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Menu from "./pages/Menu"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import OrderTracking from "./pages/OrderTracking"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import { useLanguage } from "./context/LanguageContext"

function App() {
  // const api = "http://localhost:4000";
  const api = import.meta.env.VITE_APP_API_KEY;

  const { t, language } = useLanguage()

  return (
    <Router>
      <div className={` ${language == "en" ? "font-aventon" : "font-gumela"} min-h-screen bg-background`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu api={api} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout api={api} />} />
          <Route path="/admin" element={<AdminLogin api={api} />} />
          <Route path="/admin/dashboard" element={<AdminDashboard api={api} />} />
          <Route path="/track" element={<OrderTracking api={api} />} />
          <Route path="/track/:trackingNumber" element={<OrderTracking api={api} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
