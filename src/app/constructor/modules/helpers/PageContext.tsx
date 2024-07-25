import { isEqual } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { createContext, useContext } from "react";
import usePrevious from "../../helpers/usePrevious";
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
    const isModuleAsParent = !isModuleAsSubscriber && modules[moduleArticle]?.length
    const previousFilter = usePrevious(filter)

    /*
    --- Два сценария обновления подписчиков. Один - изменение фильтров, другой - обновление при отсутствии изменения в фильтрах (актуализация.). 
    Чтобы при фильтрации не проходили лишние запросы (изменение св-ва filter влечёт за собой изменение isFetching в true), воспроизводить сценарий обновления только
    при отсутствии изменений в фильтрах
    */
    useEffect(() => {
        //если модуль не является подписчиком и имеет подписчиков
        if (isModuleAsParent) {
            //зачистка объекта фильтров от внутренних свойств фильтрации
            const filterValuesWithoutExcludes = { ...filter }
            if (excludeArticles?.length) {
                excludeArticles.forEach(article => delete filterValuesWithoutExcludes[article])
            }
            modules[moduleArticle].forEach(subscriber => {
                subscriber.setFilter(filterValuesWithoutExcludes)
            })
        }
    }, [filter])

    useEffect(() => {
        if (isModuleAsParent && isRefetching && isEqual(previousFilter, filter)) {
            modules[moduleArticle].forEach(subscriber => {
                subscriber.refetch()
            })
        }
    }, [isRefetching])
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