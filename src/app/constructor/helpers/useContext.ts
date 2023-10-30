import { createContext, useContext as useReactContext } from "react"

export const Context = createContext<any | null>(null)
export const useContext = () => useReactContext(Context)