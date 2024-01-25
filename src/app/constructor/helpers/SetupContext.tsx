import React, { useEffect, useLayoutEffect, useMemo } from "react"
import { createContext, useContext } from "react"
import { ApiSetupType } from "../../types/api"
import { WithChildren } from "../../../_metronic/helpers"
import useSetup from "../../api/hooks/useSetup"
import { setDocumentTitle, setStyles } from "./dynamicStyles"


type TSetupContext = { context: ApiSetupType, refetch: () => void }
const SetupContext = createContext<TSetupContext>({ context: {}, refetch: () => { } })
export const useSetupContext = () => useContext(SetupContext)

const SetupContextProvider: React.FC<WithChildren> = ({ children }) => {
  const { data, refetch } = useSetup()
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

  const context = useMemo(() => ({
    context: data ?? {},
    refetch
  }
  ), [data])

  return <SetupContext.Provider value={context} >{children}</SetupContext.Provider>
}

export default SetupContextProvider