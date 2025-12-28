import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LogOut, DollarSign, ShoppingBag, TrendingUp, Package, Volume2, VolumeX } from "lucide-react"
import { useLanguage } from "../../context/LanguageContext"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import axios from "axios"
import LoadingSpinner from "../../components/LoadingSpinner"
import { Icon } from "@iconify-icon/react"
import { io } from "socket.io-client"

const AdminDashboard = ({ api }) => {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState()
  const [updateLoading, setUpdateLoading] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const [highlightId, setHighlightId] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      navigate("/admin")
      return
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${api}/api/shop/status`)
        if (res.data.success) {
          setIsOpen(res.data.settings.isOpen)
        }
      } catch (error) {
        console.error("Error fetching status:", error)
      }
    }
    fetchStatus()
  }, [])


  useEffect(() => {
    const socket = io(api)

    socket.on("new_order", (newOrder) => {
      // Play Sound if enabled
      if (isSoundEnabled) {
        try {
          const audio = new Audio("/notification.mp3") // Ensure file is in public folder
          audio.play().catch(e => console.log("Audio blocked. Click the page to enable."))
        } catch (e) {
          console.log("Audio error")
        }
      }

      // Add to top of list
      setOrders((prev) => {
        const exists = prev.find(o => o._id === newOrder._id)
        if (exists) return prev
        return [newOrder, ...prev]
      })

      // Update stats in background
      fetchData(false)

      // Trigger Highlight
      setHighlightId(newOrder._id)
      setTimeout(() => setHighlightId(null), 5000)
    })

    return () => {
      socket.disconnect()
    }
  }, [api, isSoundEnabled])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [statsRes, ordersRes] = await Promise.all([
        axios.get(`${api}/api/orders/analytics`, config),
        axios.get(`${api}/api/orders`, config),
      ])
      setStats(statsRes.data)
      // setOrders(ordersRes.data)
      setOrders(ordersRes.data.orders || ordersRes.data)
    } catch (error) {
      console.error("[v0] Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    navigate("/admin")
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdateLoading(true)
      const token = localStorage.getItem("adminToken")
      await axios.patch(`${api}/api/orders/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } })
      fetchData()
      setUpdateLoading(false)
    } catch (error) {
      console.error("[v0] Error updating order:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }



  const toggleShopStatus = async () => {
    try {
      const token = localStorage.getItem("adminToken")

      // Calculate the NEW status (flip the current one)
      const newStatus = !isOpen

      const response = await axios.patch(
        `${api}/api/shop/status`,
        { isOpen: newStatus }, // Send the new status
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        // 4. Update the local state so the UI reflects the change
        setIsOpen(newStatus)

        // Show different alert based on what happened
        alert(newStatus ? t("admin.shopOpened") : t("admin.shopClosed"))
      }

    } catch (error) {
      console.error("[v0] Error updating shop status:", error)
      alert("Failed to update shop status")
    }
  }
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold text-primary">{t("admin.dashboard")}</h1>
          <div className="flex md:flex-row flex-col gap-2">

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="text-muted-foreground mr-2"
              title={isSoundEnabled ? "Mute Notifications" : "Enable Notifications"}
            >
              {isSoundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>

            <Button variant="default" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t("admin.logout")}
            </Button>

            <Button variant={`${isOpen ? "destructive" : "constructive"}`} onClick={toggleShopStatus}>
              <Icon icon={`${isOpen ? "mynaui:door-closed-solid" : "mynaui:door-open-solid"}`} />
              {isOpen ? t("admin.closeShop") : t("admin.openShop")}
            </Button>

          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("admin.totalRevenue")}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {t("menu.rm")} {(stats.totalRevenue || 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("admin.totalOrders")}</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("admin.avgOrderValue")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {t("menu.rm")} {(stats.averageOrderValue || 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("admin.pendingOrders")}</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOrders || 0}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.activeOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(orders) && orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t("admin.noActiveOrders")}</p>
              ) : (
                Array.isArray(orders) && orders.map((order) => (
                  <Card key={order._id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("admin.trackingNumber2")} {order.trackingNumber}
                          </p>
                          {order._id === highlightId && (
                            <Badge className="bg-green-500 animate-pulse text-white">NEW!</Badge>
                          )}

                          <h3 className="font-bold text-lg text-primary">{order.customerName}</h3>

                        </div>
                        <Badge
                          variant={
                            order.orderStatus === "pending"
                              ? "secondary"
                              : order.orderStatus === "ready"
                                ? "constructive"
                                : "outline"
                          }
                        >
                          {t(`admin.${order.orderStatus}`)}
                        </Badge>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">{t("admin.items")}:</h4>
                        <div>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between p-2 bg-muted rounded-lg">
                                <span>
                                  {language === "ar" ? item.nameAr : item.name}  <span className="font-bold text-primary">x {item.quantity}</span>
                                </span>
                                <span className="font-semibold">
                                  {t("menu.rm")} {(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>


                        {order.extraRequests && (
                          <div className="mt-4">
                            {t("admin.extraRequests")}
                            <p className="bg-input p-2 px-5 text-muted-foreground  rounded-lg"> {order.extraRequests}</p>
                          </div>
                        )}
                      </div>
                      <span className={`${order.paymentMethod === "payLater" ? "text-red-500" : "text-emerald-500"} font-bold`}> {t(`checkout.${order.paymentMethod}`)}</span>
                      <div className="flex md:flex-row flex-col justify-between items-center">


                        <div className="flex gap-1 items-center font-bold text-primary mb-2 text-lg">
                          <div className="text-black">
                            {t("admin.total")}:
                          </div>
                          <div className={`${language === "ar" ? "order-2" : ""}`}>{t("menu.rm")}</div>
                          <div className="font-extrabold">{order.totalAmount.toFixed(2)}
                          </div>

                        </div>


                        {updateLoading ?
                          <LoadingSpinner /> : (
                            <div className="flex gap-2  w-full justify-end">
                              {order.orderStatus === "pending" && (
                                <Button size="lg"
                                  variant="markReady"
                                  onClick={() => updateOrderStatus(order._id, "ready")}>
                                  {t("admin.markReady")}
                                </Button>
                              )}
                              {order.orderStatus === "ready" && (
                                <Button
                                  size="lg"
                                  variant="markDelivered"
                                  onClick={() => updateOrderStatus(order._id, "delivered")}
                                >
                                  {t("admin.markDelivered")}
                                </Button>
                              )}
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
