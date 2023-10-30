import React, { useEffect, useRef, useState } from "react"

type SmoothSplashScreenType = {
    active: boolean
}

const SmoothSplashScreen: React.FC<SmoothSplashScreenType> = ({active}) => {
  const [classList, setClassList] = useState("smooth-data-loader")
  const ref = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (active) {
      setClassList("smooth-data-loader visible")
      ref.current = setTimeout(() => setClassList("smooth-data-loader visible fadeIn"), 300)
    } else {
      if (ref.current) {
        clearTimeout(ref.current)
      }
      setClassList("smooth-data-loader visible")
      setTimeout(() => setClassList("smooth-data-loader"), 300)
    }
  }, [active])

    return <div className={classList}>
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

export default SmoothSplashScreen