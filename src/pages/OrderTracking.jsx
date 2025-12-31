
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Package, Clock, CheckCircle, Volume2, VolumeX } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import axios from "axios"
import { io } from "socket.io-client"

const OrderTracking = ({ api }) => {
    const { trackingNumber: urlTrackingNumber } = useParams()
    const navigate = useNavigate()
    const { t, language } = useLanguage()
    const [trackingNumber, setTrackingNumber] = useState(urlTrackingNumber || "")
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isSoundEnabled, setIsSoundEnabled] = useState(false)


    useEffect(() => {
        if (urlTrackingNumber) {
            trackOrder(urlTrackingNumber)
        }
    }, [urlTrackingNumber])


    useEffect(() => {
        if (!order) return

        const socket = io(api)

        // console.log("🔌 Connecting to socket...")

        socket.on("order_status_updated", (updatedOrder) => {
            if (updatedOrder.trackingNumber === order.trackingNumber) {
                setOrder(updatedOrder)

                // Play sound
                if (updatedOrder.orderStatus !== order.orderStatus) {
                    if (isSoundEnabled) {
                        try {
                            const audio = new Audio("/notification.mp3")
                            audio.play().catch(e => console.log("Audio blocked by browser"))
                        } catch (e) { }
                    }
                    try {
                        const audio = new Audio("/notification.mp3")
                        audio.play().catch(e => console.log("Audio blocked"))
                    } catch (e) { }
                }
            } else {
                console.log("❌ NO MATCH. Ignoring update.")
            }
        })

        return () => {
            socket.disconnect()
        }
    }, [api, order])

    const trackOrder = async (trackingNum) => {
        setLoading(true)
        setError("")
        setOrder(null)

        try {
            const response = await axios.get(`${api}/api/orders/track/${trackingNum}`)
            if (response.data.success) {
                setOrder(response.data.order)
            }
        } catch (err) {
            setError(t("tracking.notFound"))
            console.error("Tracking error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleTrack = (e) => {
        e.preventDefault()
        if (trackingNumber.trim()) {
            navigate(`/track/${trackingNumber.trim()}`)
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <Clock className="w-12 h-12 text-yellow-500" />
            case "ready":
                return <Package className="w-12 h-12 text-blue-500" />
            case "delivered":
                return <CheckCircle className="w-12 h-12 text-green-500" />
            default:
                return <Package className="w-12 h-12 text-gray-400" />
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return t("tracking.pending")
            case "ready":
                return t("tracking.ready")
            case "delivered":
                return t("tracking.delivered")
            default:
                return status
        }
    }


    const iconPulseVariant = {
        active: {
            scale: [1, 1.15, 1],
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        },
        inactive: { scale: 1 }
    }

    const checkStatus = (current, target) => {
        if (target === 'pending') return true; // Always active
        if (target === 'ready' && (current === 'ready' || current === 'delivered')) return true;
        if (target === 'delivered' && current === 'delivered') return true;
        return false;
    }


    const lineVariant = {
        completed: { width: "100%" },
        active: {
            width: ["0%", "100%"],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse", // Goes to end, then reverses back to 0
                ease: "easeInOut"
            }
        },
        inactive: { width: "0%" }
    }

    // Helper to decide line state
    const getLineStatus = (currentStatus, lineStep) => {
        // Line 1: Pending -> Ready
        if (lineStep === 'line1') {
            if (currentStatus === 'pending') return 'active'; // Animate
            if (currentStatus === 'ready' || currentStatus === 'delivered') return 'completed'; // Solid
            return 'inactive';
        }
        // Line 2: Ready -> Delivered
        if (lineStep === 'line2') {
            if (currentStatus === 'ready') return 'active'; // Animate
            if (currentStatus === 'delivered') return 'completed'; // Solid
            return 'inactive';
        }
        return 'inactive';
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-bold  text-primary">{t("tracking.title")}</h1>
                    <p className="text-xl text-muted-foreground">{t("tracking.enterTracking")}</p>
                </motion.div>

                {/* Tracking Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8"
                >
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={handleTrack} className="flex md:flex-row flex-col items-center gap-4">
                                <div className="flex-1 w-full">
                                    <Label htmlFor="trackingNumber" className="sr-only">
                                        {t("tracking.trackingNumber")}

                                    </Label>
                                    <Input
                                        id="trackingNumber"
                                        placeholder={t("tracking.trackingNumber")}
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="text-lg rounded-sm py-2"
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <Button variant="track" type="submit" size="lg" disabled={loading}>
                                        {loading ? t("loading") : t("tracking.trackButton")}
                                    </Button>
                                    {/* <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                                        className="text-muted-foreground mr-2"
                                        title={isSoundEnabled ? "Mute Notifications" : "Enable Notifications"}
                                    >
                                        {isSoundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                                    </Button> */}
                                </div>


                            </form>
                        </CardContent>

                    </Card>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Order Details */}
                <AnimatePresence mode="wait">
                    {order && (
                        <motion.div
                            key="order-details"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            {/* Status Card */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <motion.div
                                            key={order.orderStatus} // Re-animate when status changes
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        >
                                            {getStatusIcon(order.orderStatus)}
                                        </motion.div>
                                        <h2 className="text-2xl font-bold mt-4 mb-2">{getStatusText(order.orderStatus)}</h2>
                                        <p className="text-muted-foreground mb-4">
                                            {t("tracking.trackingNumber")}:{" "}
                                            <span className="font-bold text-primary">{order.trackingNumber}</span>
                                        </p>

                                        {/* Progress Bar */}
                                        <div className="w-full max-w-md mt-6 relative">
                                            <div className="flex justify-between items-center mb-2 relative z-10">

                                                {/* Step 1: Pending */}
                                                <div className="flex flex-col items-center">
                                                    <motion.div
                                                        variants={iconPulseVariant}
                                                        animate={order.orderStatus === 'pending' ? 'active' : 'inactive'}
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${checkStatus(order.orderStatus, 'pending') ? "bg-primary text-primary-foreground" : "bg-muted"
                                                            }`}
                                                    >
                                                        <Clock className="w-4 h-4" />
                                                    </motion.div>
                                                    <p className="text-xs mt-1">{language === "ar" ? "قيد التحضير" : "Preparing"}</p>
                                                </div>

                                                {/* Line 1: Pending -> Ready */}
                                                <div className="flex-1 mx-2 h-1 bg-muted rounded-full overflow-hidden flex justify-start">
                                                    <motion.div
                                                        className="h-full bg-primary"
                                                        variants={lineVariant}
                                                        initial="inactive"
                                                        animate={getLineStatus(order.orderStatus, 'line1')}
                                                    />
                                                </div>

                                                {/* Step 2: Ready */}
                                                <div className="flex flex-col items-center">
                                                    <motion.div
                                                        variants={iconPulseVariant}
                                                        animate={order.orderStatus === 'ready' ? 'active' : 'inactive'}
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${checkStatus(order.orderStatus, 'ready') ? "bg-primary text-primary-foreground" : "bg-muted"
                                                            }`}
                                                    >
                                                        <Package className="w-4 h-4" />
                                                    </motion.div>
                                                    <p className="text-xs mt-1">{language === "ar" ? "جاهز" : "Ready"}</p>
                                                </div>

                                                {/* Line 2: Ready -> Delivered */}
                                                <div className="flex-1 mx-2 h-1 bg-muted rounded-full overflow-hidden flex justify-start">
                                                    <motion.div
                                                        className="h-full bg-primary"
                                                        variants={lineVariant}
                                                        initial="inactive"
                                                        animate={getLineStatus(order.orderStatus, 'line2')}
                                                    />
                                                </div>

                                                {/* Step 3: Delivered */}
                                                <div className="flex flex-col items-center">
                                                    <motion.div
                                                        variants={iconPulseVariant}
                                                        animate={order.orderStatus === 'delivered' ? 'active' : 'inactive'}
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${checkStatus(order.orderStatus, 'delivered') ? "bg-primary text-primary-foreground" : "bg-muted"
                                                            }`}
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </motion.div>
                                                    <p className="text-xs mt-1">{language === "ar" ? "تم التسليم" : "Delivered"}</p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("tracking.orderDetails")}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t("tracking.customer")}</p>
                                        <p className="font-semibold">{order.customerName}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">{t("tracking.items")}</p>
                                        <div className="space-y-2">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between p-2 bg-muted rounded">
                                                    <span>
                                                        {language === "ar" ? item.nameAr : item.name} x{item.quantity}
                                                    </span>
                                                    <span className="font-semibold">
                                                        {t("menu.rm")} {(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-lg font-bold pt-4 border-t">
                                        <span>{t("tracking.total")}</span>
                                        <span className="text-primary">
                                            {t("menu.rm")} {order.totalAmount.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t("checkout.paymentMethod")}</p>
                                            <p className="font-semibold">
                                                {order.paymentMethod === "payLater"
                                                    ? t("checkout.payLater")
                                                    : t("checkout.payNow")}
                                            </p>

                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t("tracking.orderedAt")}</p>
                                            <p className="font-semibold">
                                                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "2-digit",
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                    hour12: true
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default OrderTracking
