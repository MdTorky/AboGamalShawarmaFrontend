import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { useCart } from "../context/CartContext"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Users, ChefHat } from "lucide-react"
import axios from "axios"
import QR1 from "../assets/img/QR.png"

const Checkout = ({ api }) => {
  const { t, language } = useLanguage()
  const { cart, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [receiptFile, setReceiptFile] = useState(null)

  // Removed paymentMethod from initial state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    extraRequests: "",
  })


  // useEffect(() => {
  //   const fetchQueueStatus = async () => {
  //     try {
  //       // We use the analytics endpoint because it already calculates 'pendingOrders'
  //       const response = await axios.get(`${api}/api/orders/analytics`)
  //       if (response.data.success) {
  //         setPendingCount(response.data.pendingOrders)
  //       }
  //     } catch (error) {
  //       console.error("Error fetching queue status:", error)
  //     }
  //   }
  //   fetchQueueStatus()
  // }, [api])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(t("checkout.fileTooLarge") || "File size must be less than 2MB")
        e.target.value = null
        setReceiptFile(null)
        return
      }
      setReceiptFile(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!receiptFile) {
      alert(t("checkout.uploadReceiptRequired") || "Please upload the payment receipt")
      return
    }

    setLoading(true)

    try {
      const data = new FormData()
      data.append("customerName", formData.name)
      data.append("email", formData.email)
      data.append("phoneNumber", formData.phone)
      data.append("whatsappNumber", formData.phone) // Using phone as whatsapp for now based on UI
      // data.append("deliveryAddress", formData.address) // Address not in form?
      data.append("items", JSON.stringify(cart.map((item) => ({
        name: item.name,
        nameAr: item.nameAr,
        price: item.price,
        quantity: item.quantity,
      }))))
      data.append("totalAmount", getCartTotal())
      data.append("extraRequests", formData.extraRequests)
      data.append("paymentMethod", "duitnow")
      data.append("receipt", receiptFile)

      const response = await axios.post(`${api}/api/orders/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        alert(t("checkout.orderSuccess"))
        clearCart()
        navigate(`/track/${response.data.trackingNumber}`)
      }
    } catch (error) {
      console.error("Error placing order:", error)
      const msg = error.response?.data?.message || t("checkout.orderError")
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary">{t("checkout.title")}</h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t("checkout.customerInfo")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t("checkout.name")}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t("checkout.email")}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t("checkout.whatsapp")}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+60123456789"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="extraRequests">{t("checkout.extraRequests")}</Label>
                    <Input
                      id="extraRequests"
                      name="extraRequests"
                      value={formData.extraRequests}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>

                  <div className="bg-muted p-4 rounded-lg text-center mt-4">
                    <Label className="mb-2 block text-lg font-semibold">{t("checkout.scanToPay")}</Label>
                    <div className="flex justify-center gap-4 mb-4">
                      <img src={QR1} alt="DuitNow QR" className="mx-auto w-80 h-80 object-contain p-2 rounded-lg" />
                    </div>

                    <div className="text-start">
                      <Label htmlFor="receipt" className="mb-2 block">{t("checkout.uploadReceipt")}</Label>
                      <Input
                        id="receipt"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="w-full bg-background"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("checkout.maxSize")}
                      </p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t("loading") : t("checkout.placeOrder")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("checkout.orderSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <span>
                        {language === "en" ? item.name : item.nameAr} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        {t("menu.rm")} {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>{t("cart.total")}</span>
                      <span className="text-primary">
                        {t("menu.rm")} {getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
