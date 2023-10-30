import React from "react"

type SplashScreenType = {
    active: boolean, 
    className?: string,
}

const SplashScreen: React.FC<SplashScreenType> = ({active, className = ""}) => {

    return <div className={`data-loader${active ? "" : " hidden"} ${className}`}>
    <svg className="splash-spinner" viewBox="0 0 50 50">
        <circle className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        ></circle>
      </svg>
  </div>
}

export default SplashScreen