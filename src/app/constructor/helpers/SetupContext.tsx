import React, { useEffect, useLayoutEffect } from "react"
import { createContext, useContext } from "react"
import { ApiSetupType } from "../../types/api"
import { WithChildren } from "../../../_metronic/helpers"
import useSetup from "../../api/hooks/useSetup"
import { setDocumentTitle, setStyles } from "./dynamicStyles"

const SetupContext = createContext<ApiSetupType>({})
export const useSetupContext = () => useContext(SetupContext)

const SetupContextProvider: React.FC<WithChildren> = ({ children }) => {
  const { data } = useSetup()
  useLayoutEffect(() => {
    setDocumentTitle()
    /* в метронике есть запуск. Нужно проработать */
    document.body.setAttribute('data-kt-app-header-fixed', 'true')
    document.body.setAttribute('data-kt-app-header-fixed-mobile', 'true')
  }, [])
  useEffect(() => {
    if (data) {
      setStyles(data.theme)
    }
  }, [data])

  return <SetupContext.Provider value={data ?? {}} >{children}</SetupContext.Provider>
}

export default SetupContextProvider