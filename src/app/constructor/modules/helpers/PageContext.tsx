import React, { useCallback, useEffect, useMemo, useState } from "react"
import { createContext, useContext } from "react";
/*
-- Контекст страницы для общения модулей между собой 
*/
type PageContextType = {
    modules: { [key: string]: Array<() => void> }
    changeContext: (refetch: () => void, parentModuleArticle: string) => void
}

const pageContextInitials = {
    modules: {},
    changeContext: () => { }
}

const PageContext = createContext<PageContextType>(pageContextInitials)

export const usePageContext = () => useContext(PageContext)

export const useSubscribeOnRefetch = (refetch: () => void, linked_filter?: string) => {
    const { changeContext } = usePageContext()

    useEffect(() => {
        if (linked_filter) {
            changeContext(refetch, linked_filter)
        }
    }, [])
}

export const useRefetchSubscribers = (moduleArticle: string, isRefetching: boolean, isModuleAsSubscriber: boolean) => {
    const { modules } = usePageContext()
    useEffect(() => {
        if (!isModuleAsSubscriber && isRefetching && modules[moduleArticle]?.length) {

            modules[moduleArticle].forEach(refetchFunc => setTimeout(refetchFunc, 300))
        }
    }, [isRefetching])
}

const PageProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const [modules, setModules] = useState<PageContextType["modules"]>({})

    const changeContext = useCallback((refetch: () => void, parentModuleArticle: string) => setModules(prev => {
        if (Array.isArray(prev[parentModuleArticle]) && prev[parentModuleArticle].includes(refetch)) {
            return prev
        } else {
            const clone = { ...prev }
            if (Array.isArray(clone[parentModuleArticle])) {
                clone[parentModuleArticle].push(refetch)
            } else {
                clone[parentModuleArticle] = [refetch]
            }
            return clone
        }
    }), [])

    const context = useMemo(() => ({
        modules,
        changeContext
    }), [modules])

    return <PageContext.Provider value={context}>
        {children}
    </PageContext.Provider>
}

export default PageProvider