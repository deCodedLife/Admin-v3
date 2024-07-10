import { isEqual } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { createContext, useContext } from "react";
/*
-- Контекст страницы для общения модулей между собой 
*/
type PageContextType = {
    modules: { [key: string]: Array<{ refetch: () => void, setFilter: React.Dispatch<any> }> }
    changeContext: (refetch: () => void, setFilter: React.Dispatch<any>, parentModuleArticle: string) => void
}

const pageContextInitials = {
    modules: {},
    changeContext: () => { }
}

const PageContext = createContext<PageContextType>(pageContextInitials)

export const usePageContext = () => useContext(PageContext)

export const useSubscribeOnRefetch = (refetch: () => void, setFilter: React.Dispatch<any>, linked_filter?: string) => {
    const { changeContext } = usePageContext()

    useEffect(() => {
        if (linked_filter) {
            changeContext(refetch, setFilter, linked_filter)
        }
    }, [])
}

export const useRefetchSubscribers = (moduleArticle: string, isRefetching: boolean, isModuleAsSubscriber: boolean, filter: any, excludeArticles?: Array<string>) => {
    const { modules } = usePageContext()

    useEffect(() => {
        if (!isModuleAsSubscriber && modules[moduleArticle]?.length) {

            const filterValuesWithoutExcludes = { ...filter }
            if (excludeArticles?.length) {
                excludeArticles.forEach(article => delete filterValuesWithoutExcludes[article])
            }
            
            modules[moduleArticle].forEach(subscriber => {
                subscriber.setFilter((prev: any) => {
                    const actualFilterValues = Object.assign({}, prev, filterValuesWithoutExcludes)
                    if (isEqual(prev, actualFilterValues)) {
                        subscriber.refetch()
                        return prev
                    } else {
                        return actualFilterValues
                    }
                })
            })
        }
    }, [filter])
}

const PageProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const [modules, setModules] = useState<PageContextType["modules"]>({})

    const changeContext = useCallback((refetch: () => void, setFilter: React.Dispatch<any>, parentModuleArticle: string) => setModules(prev => {
        if (Array.isArray(prev[parentModuleArticle]) && prev[parentModuleArticle].some(subscriber => isEqual(subscriber, { refetch, setFilter }))) {
            return prev
        } else {
            const clone = { ...prev }
            if (Array.isArray(clone[parentModuleArticle])) {
                clone[parentModuleArticle].push({ refetch, setFilter })
            } else {
                clone[parentModuleArticle] = [{ refetch, setFilter }]
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