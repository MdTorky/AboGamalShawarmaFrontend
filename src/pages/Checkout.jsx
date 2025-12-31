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
  const [pendingCount, setPendingCount] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    extraRequests: "",
    paymentMethod: "cash",
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        customerName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        whatsappNumber: formData.phone,
        deliveryAddress: formData.address,
        items: cart.map((item) => ({
          name: item.name,
          nameAr: item.nameAr,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: getCartTotal(),
        extraRequests: formData.extraRequests,
        paymentMethod: formData.paymentMethod,
      }

      const response = await axios.post(`${api}/api/orders/create`, orderData)

      if (response.data.success) {
        alert(t("checkout.orderSuccess"))
        clearCart()
        navigate(`/track/${response.data.trackingNumber}`)
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert(t("checkout.orderError"))
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
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-center gap-3 shadow-sm"
        >
          <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
            <ChefHat className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground font-medium">
              {language === "ar" ? "حالة المطعم الحالية" : "Current Restaurant Status"}
            </p>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
              {pendingCount === 0
                ? (language === "ar" ? "لا يوجد طلبات انتظار، اطلب الآن!" : "No queue right now. Order fast!")
                : (language === "ar"
                  ? `يوجد ${pendingCount} طلبات قيد التحضير حالياً`
                  : `There are ${pendingCount} orders being prepared currently`
                )
              }
            </p>
          </div>
        </motion.div> */}

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
                  {/* <div>
                    <Label htmlFor="phone">{t("checkout.phone")}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div> */}
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
                    // rows={3}
                    />
                  </div>

                  <div>
                    <Label>{t("checkout.paymentMethod")}</Label>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="payLater" id="payLater" />
                        <Label htmlFor="payLater" className="font-normal">
                          {t("checkout.payLater")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="payNow" id="payNow" />
                        <Label htmlFor="payNow" className="font-normal">
                          {t("checkout.payNow")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.paymentMethod === "payNow" && (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="flex justify-center gap-4 mb-2">
                        <img src={QR1} alt="DuitNow QR" className="mx-auto mb-2 w-80 h-80" />
                        {/* <img src={QR2} alt="DuitNow QR" className="mx-auto mb-2 w-30 h-30" /> */}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("checkout.scanToPay")}
                      </p>
                    </div>
                  )}

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
