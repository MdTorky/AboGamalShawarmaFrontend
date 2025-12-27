"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import Shawarma from '../assets/Shawarma.png'
import { Icon } from "@iconify-icon/react"

const Home = () => {
  const { t, language } = useLanguage()

  const contactInfo = [
    {
      icon: "ion:phone-portrait",
      title: t("contact.phone"),
      value: "+60 12-345 6789",
    },
    {
      icon: "fluent:mail-copy-20-filled",
      title: t("contact.email"),
      value: "abogamal.shawarma@gmail.com",
    },
    {
      icon: "ic:baseline-whatsapp",
      title: t("contact.whatsappGroup"),
      link: "https://chat.whatsapp.com/KyM9UYPKHguFnaCio0127b",
    },
    {
      icon: "uil:clock-three",
      title: t("contact.hours"),
      value: t("contact.everyday"),
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            // className={language === "ar" ? "" : ""}
            >
              <h1 className=" text-5xl md:text-6xl lg:text-8xl font-bold mb-6 text-balance">
                <span className="text-primary">{t("hero.title")}</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-1 font-semibold">{t("hero.subtitle")}</p>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">{t("hero.description")}</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu">
                  <button
                    className="relative bg-primary text-white font-medium text-[17px] px-4 py-[0.35em] pl-5 h-[2.8em] rounded-[0.9em] flex items-center overflow-hidden cursor-pointer shadow-[inset_0_0_1.6em_-0.6em_#652400] group"
                  >
                    <span className={`${language === "ar" ? "ml-10" : "mr-10"} text-xl`}> {t("hero.orderNow")}</span>
                    <div
                      className={` ${language === "ar" ? "left-[0.3em]" : "right-[0.3em]"} absolute  bg-white h-[2.2em] w-[2.2em] rounded-[0.7em] flex items-center justify-center transition-all duration-300 group-hover:w-[calc(100%-0.6em)] shadow-[0.1em_0.1em_0.6em_0.2em_#652400] active:scale-95"`}
                    >
                      <Icon icon={`${language === "en" ? "solar:arrow-right-broken" : "solar:arrow-left-broken"}`} className="w-20 transition-transform duration-300 text-primary group-hover:translate-x-[0.1em]" />
                    </div>
                  </button>

                </Link>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={language === "ar" ? "lg:order-1" : ""}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-20" />
                <img
                  src={Shawarma}
                  alt="Shawarma"
                  className="relative rounded-2xl w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      <div className="max-w-7xl mx-auto mb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-primary">{t("contact.title")}</h1>
          <p className="text-2xl text-muted-foreground">{t("contact.getInTouch")}</p>
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
                  <Icon icon={info.icon} className="text-2xl text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                    {info.link ? (
                      <a href={info.link} target="_blank" rel="noopener noreferrer" className="text-primary">
                        {t("contact.joinWhatsapp")}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{info.value}</p>
                    )}

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
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249.2729405474445!2d103.6280636116423!3d1.5454273052608873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da7405a48c2ef1%3A0xe051339a947257be!2sPrimadona%20Cafe!5e0!3m2!1sen!2smy!4v1766798905789!5m2!1sen!2smy"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Abo Gamal Shawarma Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
export default Home
