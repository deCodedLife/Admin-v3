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

    const initialKey = resolvedTabs.length ? resolvedTabs[0].key : null
    const [key, setKey] = useState<string | null>(initialKey)
    const navigate = useNavigate()
    const location = useLocation()
    const modalContext = useReactContext<any>(ModalContext)

    const isTabsInsideModal = Boolean(modalContext.insideModal)

    const handleChangeTab = (key: string | null) => {
        const queryString = isTabsInsideModal && location.search ? location.search.replace(/&tab=.*/, "") + `&tab=${key}` : `?tab=${key}`
        navigate(queryString)
        setKey(key)
    }

    useEffect(() => {
        if (resolvedTabs.length && key !== initialKey) {
            handleChangeTab(initialKey)
        }
    }, [resolvedTabs])

    return <div>
        <Tabs
            id="moduleTabs"
            activeKey={key as string | undefined}
            onSelect={handleChangeTab}
            className="mb-3"
            mountOnEnter
            unmountOnExit
        >
            {resolvedTabs.map(tab => <Tab key={tab.key} eventKey={tab.key}
                title={<div className="moduleTabs_tabTitle">{tab.title}{tab.settings?.counter ? <span className="moduleTabs_tabCounter badge badge-primary">{tab.settings?.counter}</span> : null}</div>}>
                <PageBuilder data={tab.body} isFetching={false} showProgressBar={false} />
            </Tab>)}
        </Tabs>
    </div>
})

export default ModuleTabs