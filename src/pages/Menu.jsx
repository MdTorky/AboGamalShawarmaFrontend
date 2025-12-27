import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "../context/LanguageContext"
import { useCart } from "../context/CartContext"
import axios from "axios"
import menuData from '../locales/menu-data.json';
import shawarma from '../assets/Shawarma.png'
import { Lock } from "lucide-react"
import { Button } from "../components/ui/button"
import { Icon } from "@iconify-icon/react"

const Menu = ({ api }) => {
  const { t, language } = useLanguage()
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [shopStatus, setShopStatus] = useState({ isOpen: true, closedMessage: {}, openingHours: "", openingHoursArabic: "" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusResponse = await axios.get(`${api}/api/shop/status`)
        if (statusResponse.data.success) {
          setShopStatus(statusResponse.data.settings)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [api])

  const MenuCard = ({ item }) => {

    const [count, setCount] = useState(1)
    const [isFlying, setIsFlying] = useState(false)
    const [startPos, setStartPos] = useState({ top: 0, left: 0, width: 0 })
    const [targetPos, setTargetPos] = useState({ top: 0, left: 0 })
    const imgRef = useRef(null)
    const handleIncrement = () => setCount(prev => prev + 1)

    const handleDecrement = () => {
      if (count > 1) {
        setCount(prev => prev - 1)
      }
    }

    const handleAddToCart = (item) => {
      if (!shopStatus.isOpen) {
        alert(language === "ar" ? "المتجر مغلق حالياً" : "Shop is currently closed")
        return
      }

      if (imgRef.current) {
        // 1. Get Start Position (The Card Image)
        const rect = imgRef.current.getBoundingClientRect()
        setStartPos({
          top: rect.top,
          left: rect.left,
          width: rect.width
        })

        // 2. Get Target Position (The Navbar Cart Icon)
        const cartElement = document.getElementById("cart-icon-container")
        if (cartElement) {
          const cartRect = cartElement.getBoundingClientRect()
          setTargetPos({
            top: cartRect.top,
            left: cartRect.left
          })
        }

        setIsFlying(true)
        setTimeout(() => setIsFlying(false), 800)
      }

      addToCart(item, count)
    }

    return (
      <div className="bg-white shadow-xl rounded-3xl pt-4 pb-4 px-4 group hover:ring-3 ring-0 ring-primary transition duration-500 relative">
        {isFlying && createPortal(
          <AnimatePresence>
            <motion.img
              key={`fly-${item._id}`}
              src={`/images/${item.image}`}
              initial={{
                position: "fixed",
                top: startPos.top,
                left: startPos.left,
                width: startPos.width,
                opacity: 1,
                zIndex: 9999, // Super high z-index
                borderRadius: "1rem",
                pointerEvents: "none"
              }}
              animate={{
                top: targetPos.top,  // Dynamic Target Top
                left: targetPos.left, // Dynamic Target Left
                width: "20px",
                height: "20px",
                opacity: 0.5,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </AnimatePresence>,
          document.body
        )}
        <div className="w-full h-64">
          <img
            ref={imgRef}
            className="w-70 h-70 object-fill rounded-2xl group-hover:scale-120 transition duration-500"
            src={`/images/${item.image}`}
            alt={item.name}
          />
        </div>

        <h2 className="capitalize font-semibold text-lg mt-10 text-gray-900">
          {language === "en" ? item.name : item.nameAr}
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center font-bold text-primary my-2 text-lg">
            <div className={`${language === "ar" ? "order-2" : ""}`}>{t("menu.rm")}</div>
            <div className="font-extrabold">{item.price.toFixed(2)}</div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outlineNegative"
              size="icon"
              onClick={handleDecrement}
            >
              <Icon icon="typcn:minus" className="h-4 w-4" />
            </Button>
            <span className="text-lg font-bold w-5 text-center">{count}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
            >
              <Icon icon="typcn:plus" className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          {/* Call local onAdd function */}
          <button
            className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary/80 transition duration-300 hover:scale-105 w-full mt-2 cursor-pointer "
            onClick={() => handleAddToCart(item)}
          >
            {t("menu.addToCart")}
          </button>
        </div>
      </div>
    )
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">{t("loading")}</div>
      </div>
    )
  }


  if (!shopStatus.isOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <Lock className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-4xl font-bold mb-4 text-primary">{t("shop.closed")}</h1>
          <p className="text-xl text-muted-foreground mb-6">
            {shopStatus.closedMessage[language] || t("shop.closedMessage")}
          </p>
          {shopStatus.openingHours && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold">{t("shop.openingHours")}</p>
              <p className="text-muted-foreground">{language ===
                "en" ? shopStatus.openingHours : shopStatus.openingHoursArabic}</p>
            </div>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-7xl font-bold text-primary">{t("menu.title")}</h1>
          <p className="text-2xl text-muted-foreground">{t("menu.subtitle")}</p>
        </motion.div>

        {/* Menu Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          {menuData.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <MenuCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Menu
