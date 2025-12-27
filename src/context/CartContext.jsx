"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // const addToCart = (item) => {
  //   setCart((prevCart) => {
  //     const existingItem = prevCart.find((i) => i._id === item._id)
  //     if (existingItem) {
  //       return prevCart.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i))
  //     }
  //     return [...prevCart, { ...item, quantity: 1 }]
  //   })
  // }

  const addToCart = (item, count = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i._id === item._id)
      if (existingItem) {
        return prevCart.map((i) =>
          // Add the new count to the existing quantity
          i._id === item._id ? { ...i, quantity: i.quantity + count } : i
        )
      }
      // Add new item with the specific count
      return [...prevCart, { ...item, quantity: count }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prevCart) => prevCart.map((item) => (item._id === itemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
