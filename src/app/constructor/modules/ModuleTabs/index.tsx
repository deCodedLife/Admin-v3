import React, { useEffect, useState, useContext as useReactContext, useMemo } from "react"
import { Tab, Tabs } from "react-bootstrap"
import PageBuilder from "../../../pages/PageBuilder"
import { useLocation, useNavigate } from "react-router-dom"
import { ModalContext } from "../ModuleSchedule"
import { TModuleTabs } from "./_types"

const ModuleTabs = React.memo<TModuleTabs>(props => {
    const { settings } = props


    const resolvedTabs = useMemo(() => {
        if (settings) {
            if (Array.isArray(settings)) {
                return settings.filter(tab => tab.settings?.is_visible !== false).map(tab => ({ ...tab, key: tab.title }))
            } else {
                return Object.entries(settings).map(([article, tab]) => ({ ...tab, key: article }))
            }
        } else {
            return []
        }
    }, [settings])


    const navigate = useNavigate()
    const location = useLocation()
    const modalContext = useReactContext<any>(ModalContext)
    const isTabsInsideModal = Boolean(modalContext.insideModal)
    
    const initialKey = useMemo(() => {
        const initialQueryStringKey = location.search.match(/\?tab=\w+/gi)?.[0].replace(/\?tab=/, "")
        const isValidInitialKey = initialQueryStringKey ? resolvedTabs.some(tab => tab.key === initialQueryStringKey) : false
        if (!isTabsInsideModal && isValidInitialKey) {
            return initialQueryStringKey as string
        } else {
            return resolvedTabs.length ? resolvedTabs[0].key : null
        }

    }, [resolvedTabs])

    const [key, setKey] = useState<string | null>(initialKey)

    useEffect(() => {
        if (key) {
            const queryString = isTabsInsideModal && location.search ? location.search.replace(/&tab=.*/, "") + `&tab=${key}` : `?tab=${key}`
            navigate(queryString)
        }
    }, [key])

    useEffect(() => {
        /* Проверка на модальное окно стоит для случаев, когда модалку не нужно закрывать, но саму страницу внутри нужно перезагрузить */
        if (resolvedTabs.length && key !== initialKey && !isTabsInsideModal) {
            setKey(initialKey)
        }
    }, [resolvedTabs])

    return <div>
        <Tabs
            id="moduleTabs"
            activeKey={key as string | undefined}
            onSelect={setKey}
            className="mb-3"
            mountOnEnter
            unmountOnExit
        >
            {resolvedTabs.map(tab => <Tab
                key={tab.key}
                eventKey={tab.key}
                title={<div className="moduleTabs_tabTitle">{tab.title}{tab.settings?.counter ? <span className="moduleTabs_tabCounter badge badge-primary">{tab.settings?.counter}</span> : null}</div>}>
                <PageBuilder data={tab.body} isFetching={false} showProgressBar={false} />
            </Tab>)}
        </Tabs>
    </div>
})

export default ModuleTabs