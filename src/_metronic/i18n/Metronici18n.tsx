import React, { FC, createContext, useContext, useEffect } from 'react'
import { WithChildren } from '../helpers'
import { useSetupContext } from '../../app/constructor/helpers/SetupContext'
import moment from 'moment'

const I18N_CONFIG_KEY = process.env.REACT_APP_I18N_CONFIG_KEY || 'i18nConfig'

const parseServerLang = (serverLang: string) => {
  switch (serverLang) {
    case "ru":
    case "en":
    case "lv":
      return serverLang
    case "lat":
      return "lv"
    default:
      return "ru"
  }
}

type Props = {
  /*   selectedLang: 'de' | 'en' | 'es' | 'fr' | 'ja' | 'zh' */
  selectedLang: "ru" | "en" | "lv"
}
const initialState: Props = {
  selectedLang: "ru",
}

function getConfig(applicationInitLang?: Props["selectedLang"] | "lat"): Props {
  const ls = localStorage.getItem(I18N_CONFIG_KEY)
  if (ls) {
    try {
      return JSON.parse(ls) as Props
    } catch (er) {
      console.error(er)
    }
  }
  return applicationInitLang ? { selectedLang: parseServerLang(applicationInitLang) } : initialState
}

// Side effect
export function setLanguage(lang: string) {
  localStorage.setItem(I18N_CONFIG_KEY, JSON.stringify({ selectedLang: lang }))
  window.location.reload()
}

const I18nContext = createContext<Props>(initialState)

const useLang = () => {
  return useContext(I18nContext).selectedLang
}

const MetronicI18nProvider: FC<WithChildren> = ({ children }) => {
  const { context } = useSetupContext()
  const lang = getConfig(context.lang)
  useEffect(() => {
    moment.locale(lang.selectedLang)
  }, [lang])

  return <I18nContext.Provider value={lang}>{children}</I18nContext.Provider>
}

export { MetronicI18nProvider, useLang }
