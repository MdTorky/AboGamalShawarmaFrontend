"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { useCart } from "../context/CartContext"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Icon } from "@iconify-icon/react"

const Cart = () => {
  const { t, language } = useLanguage()
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">{t("cart.empty")}</h2>
          <Link to="/menu">
            <Button size="lg">{t("cart.continueShopping")}</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary">{t("cart.title")}</h1>
        </motion.div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cart.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={`/images/${item.image}`}
                      alt={item.name[language]}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{language === "en" ? item.name : item.nameAr}</h3>
                      <div className="flex md:flex-row flex-col md:items-center justify-between md:gap-0 gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outlineNegative"
                            size="icon"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                            <Icon icon="typcn:minus" className="h-4 w-4" />
                          </Button>
                          <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            <Icon icon="typcn:plus" className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 justify-end md:justify-center">
                          <div className="flex gap-1 items-center font-bold text-primary my-2 text-lg">
                            <div className={`${language === "ar" ? "order-2" : ""}`}>{t("menu.rm")}</div>
                            <div className="font-extrabold">{(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                          <Button variant="destructive" size="icon" onClick={() => removeFromCart(item._id)}>
                            <Icon icon="typcn:delete" className="text-lg" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Cart Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>{t("cart.subtotal")}</span>
                  <span className="font-semibold">
                    {t("menu.rm")} {getCartTotal().toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>{t("cart.total")}</span>
                    <span className="text-primary">
                      {t("menu.rm")} {getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Link to="/menu" className="flex-1">
                    <button className="bg-transparent text-primary px-4 py-2 rounded-2xl hover:bg-emerald-600 hover:text-white transition duration-300 hover:scale-105 w-full cursor-pointer text-sm md:text-lg ">{t("cart.continueShopping")}</button>
                  </Link>
                  <Link to="/checkout" className="flex-1">
                    <button className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary/80 transition duration-300 hover:scale-105 w-full cursor-pointer text-sm md:text-lg ">{t("cart.checkout")}</button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Cart
