"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ShoppingCart, Globe } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { useCart } from "../context/CartContext"
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { Icon } from '@iconify-icon/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { t, language, toggleLanguage } = useLanguage()
  const { getCartCount } = useCart()

  const navLinks = [
    { path: "/", label: t("nav.home"), icon: "lineicons:home-2" },
    { path: "/menu", label: t("nav.menu"), icon: "mdi:food" },
    // { path: "/about", label: t("nav.about") },
    // { path: "/contact", label: t("nav.contact"), icon: "mingcute:location-2-fill" },
    { path: "/track", label: t("nav.track"), icon: "ri:gps-fill" }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav className="sticky top-0 z-50"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className=" max-w-4xl rounded-b-3xl mx-auto px-4 sm:px-6 lg:px-8  bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 shadow-sm
">
        <div className="flex justify-between items-center h-16 ">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* <div className="text-2xl font-bold text-primary">{language === "ar" ? "شاورما فهمان" : "Shawrama Fahman"}</div> */}
            <img src="/Logo.png" className="w-30" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center md:flex space-x-8">
            {navLinks.map((link) => (
              <div className={`text-lg gap-2 ${isActive(link.path) ? "text-primary" : "text-muted-foreground group hover:text-primary transition-colors"}`} key={link.path}>
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 cursor-pointer font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-muted-foreground"}`}
                >
                  <Icon icon={link.icon} className="text-lg" />
                  <div className="flex items-center">{link.label}</div>
                </Link>
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="hidden md:flex items-center gap-2 cursor-pointer">
              <Globe className="h-4 w-4" />
              <span className={`${language === "en" ? "font-gumela" : "font-aventon"}`}>{language === "en" ? "العربية" : "English"}</span>
            </Button>

            {/* Cart Icon */}
            {/* <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Button>
            </Link> */}

            <Link to="/cart" className="relative" id="cart-icon-container"> {/* <--- ADD ID HERE */}
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-t">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(link.path) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => {
                toggleLanguage()
                setIsOpen(false)
              }}
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === "en" ? "العربية" : "English"}
            </Button>
          </div>
        </div>
      )}
    </motion.nav>
  )
}

export default Navbar
