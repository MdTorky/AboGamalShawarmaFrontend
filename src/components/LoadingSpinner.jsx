
import { useLanguage } from "../context/LanguageContext"
import loader from '../assets/img/loader.png';

const LoadingSpinner = () => {
  const { t } = useLanguage()

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Spinning Shawarma Icon */}
        <div className="relative w-48 h-48 mx-auto mb-4">
          <div className="absolute inset-0 shawarma-spin">
            <img src={loader} alt="" />
            {/* <svg viewBox="0 0 100 100" className="w-full h-full text-primary" fill="currentColor">
              <ellipse cx="50" cy="50" rx="45" ry="20" opacity="0.3" />
              <path d="M50 10 Q 70 30, 50 50 Q 30 30, 50 10" />
              <path d="M50 50 Q 70 70, 50 90 Q 30 70, 50 50" />
              <circle cx="50" cy="30" r="3" className="text-accent" />
              <circle cx="60" cy="50" r="3" className="text-accent" />
              <circle cx="40" cy="70" r="3" className="text-accent" />
            </svg> */}
          </div>
        </div>
        <p className="text-2xl font-medium text-primary animate-pulse">{t("loading")}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
