import React, { useEffect, useState, useContext as useReactContext } from "react"
import { Tab, Tabs } from "react-bootstrap"
import PageBuilder from "../../page/PageBuilder"
import { ModuleTabsType } from "../../types/modules"
import { useLocation, useNavigate } from "react-router-dom"
import { ModalContext } from "./ModuleSchedule/ModuleSchedule"

const ModuleTabs = React.memo<ModuleTabsType>((props) => {
    const { settings } = props
    const initialKey = settings.length ? settings[0].title : null
    const [key, setKey] = useState<string | null>(initialKey)
    const navigate = useNavigate()
    const location = useLocation()
    const modalContext = useReactContext<any>(ModalContext)

    const isTabsInsideModal = Boolean(modalContext.insideModal)

    const handleChangeTab = (key: string | null) => {
        const queryString = isTabsInsideModal && location.search ? location.search.replace(/&tab=.*/, "") + `&tab=${key}` :  `?tab=${key}`
        navigate(queryString)
        setKey(key)
    }

    useEffect(() => {
        if (settings.length && key !== initialKey) {
            handleChangeTab(initialKey)
        }
    }, [settings])
    
    return <div>
        <Tabs
            id="moduleTabs"
            activeKey={key as string | undefined}
            onSelect={handleChangeTab}
            className="mb-3"
            mountOnEnter
            unmountOnExit

        >
            {settings.map(tab => <Tab key={tab.title} eventKey={tab.title}
             title={<div className="moduleTabs_tabTitle">{tab.title}{tab.counter ? <span className="moduleTabs_tabCounter badge badge-primary">{tab.counter}</span> : null}</div>}>
                <PageBuilder data={tab.body} isFetching={false} showProgressBar={false} />
            </Tab>)}
        </Tabs>
    </div>
})

export default ModuleTabs