"use client"

import { motion } from "framer-motion"
import { Award, Heart, Users } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"

const About = () => {
  const { t, language } = useLanguage()

  const features = [
    {
      icon: Heart,
      title: t("about.quality"),
      description: t("about.qualityText"),
    },
    {
      icon: Award,
      title: t("about.tradition"),
      description: t("about.traditionText"),
    },
    {
      icon: Users,
      title: language === "ar" ? "فريق محترف" : "Professional Team",
      description:
        language === "ar"
          ? "فريق من الطهاة المحترفين الملتزمين بتقديم أفضل تجربة طعام"
          : "A team of professional chefs committed to delivering the best dining experience",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t("about.title")}</h1>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h2 className="text-3xl font-bold mb-6">{t("about.story")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">{t("about.storyText")}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "نستخدم أفضل المكونات ونتبع أعلى معايير النظافة والجودة لضمان رضا عملائنا."
                : "We use the finest ingredients and follow the highest standards of cleanliness and quality to ensure customer satisfaction."}
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-2xl blur-2xl opacity-20" />
            <img src="/shawarma-chef-preparing-food.jpg" alt="About Us" className="relative rounded-2xl shadow-xl w-full" />
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-xl shadow-lg"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
