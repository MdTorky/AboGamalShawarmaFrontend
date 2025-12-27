
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
          </div>
        </div>
        <p className="text-2xl font-medium text-primary animate-pulse">{t("loading")}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
