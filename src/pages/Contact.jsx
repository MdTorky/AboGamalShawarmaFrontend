"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"

const Contact = () => {
  const { t } = useLanguage()

  const contactInfo = [
    {
      icon: Phone,
      title: t("contact.phone"),
      value: "+60 12-345 6789",
    },
    {
      icon: Mail,
      title: t("contact.email"),
      value: "abogamal.shawarma@gmail.com",
    },
    {
      icon: MapPin,
      title: t("contact.address"),
      value: "123 Food Street, Kuala Lumpur, Malaysia",
    },
    {
      icon: Clock,
      title: t("contact.hours"),
      value: t("contact.everyday"),
    },
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t("contact.title")}</h1>
          <p className="text-xl text-muted-foreground">{t("contact.getInTouch")}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 bg-card p-6 rounded-xl shadow-lg"
                >
                  <info.icon className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                    <p className="text-muted-foreground">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-muted rounded-xl overflow-hidden shadow-xl h-full min-h-[400px]">
              <img src="/restaurant-location-map.png" alt="Location Map" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
