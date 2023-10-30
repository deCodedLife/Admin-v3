import { createContext, useContext } from "react";

/* Контекст модулей, содержит такие базовые вещи, как обновление запроса данных по модулю и т.д */


type ModuleContextType = {
    refresh: () => void
}
const initialContextValues = {
    refresh: () => {}
}
export const ModuleContext = createContext<ModuleContextType>(initialContextValues)

export const useModuleContext = () => useContext(ModuleContext)
