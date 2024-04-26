import React, { useEffect, useState } from "react"
import { Col, Form, ProgressBar } from "react-bootstrap"
import ModuleAppEditor from "../constructor/modules/ModuleAppEditor"
import ModuleCalendar from "../constructor/modules/ModuleCalendar"
import ModuleChat from "../constructor/modules/ModuleChat"
import ModuleDocuments from "../constructor/modules/ModuleDocuments"
import ModuleForm from "../constructor/modules/ModuleForm"
import ModuleFunnel from "../constructor/modules/ModuleFunnel"
import ModuleHeader from "../constructor/modules/ModuleHeader"
import ModuleInCreation from "../constructor/modules/ModuleInCreation"
import ModuleInfo from "../constructor/modules/ModuleInfo"
import ModuleLinksBlock from "../constructor/modules/ModuleLinksBlock"
import ModuleList from "../constructor/modules/ModuleList"
import ModuleLogs from "../constructor/modules/ModuleLogs"
import ModuleMiniChat from "../constructor/modules/ModuleMiniChat"
import ModuleNews from "../constructor/modules/ModuleNews"
import ModuleRoles from "../constructor/modules/ModuleRoles"
import ModuleSchedule from "../constructor/modules/ModuleSchedule"
import ModuleTabs from "../constructor/modules/ModuleTabs"
import ModuleWidgets from "../constructor/modules/ModuleWidgets"
import { TApiModule as ModuleType } from "../types/api"
import { TPageBuilder } from "../types/global"
import { useLocation } from "react-router-dom"
import ModuleAccordion from "../constructor/modules/ModuleAccordion"
import ModuleDayPlanning from "../constructor/modules/ModuleDayPlanning"
import ModuleQueue from "../constructor/modules/ModuleQueue"
import ModuleYandexMap from "../constructor/modules/ModuleYandexMap"
import PageProvider from "../constructor/modules/helpers/PageContext"
import ModuleButtons from "../constructor/modules/ModuleButtons"
import ModuleTariffs from "../constructor/modules/ModuleTariffs"
import ModuleHtmlPage from "../constructor/modules/ModuleHtmlPage"

const PageProgressBar: React.FC<{ isFetching: boolean }> = ({ isFetching }) => {
    const [progress, setProgress] = useState(0)
    const [isHidden, setIsHidden] = useState(true)
    useEffect(() => {
        if (isFetching) {
            setProgress(0)
            setIsHidden(false)
            const id = setInterval(() => setProgress(prev => (prev <= 80) ? prev += 10 : prev), 100)
            return () => {
                clearInterval(id)
                setProgress(100)
                setTimeout(() => setIsHidden(true), 700);
            }
        }
    }, [isFetching])
    return <div className="pageBuilder_progressBar">
        <ProgressBar variant="primary" now={progress} hidden={isHidden} />
    </div>
}
const Module: React.FC<ModuleType> = (props) => {
    switch (props.type) {
        case "header":
            return <ModuleHeader {...props} />
        case "list":
            return <ModuleList {...props} />
        case "form":
            return <ModuleForm {...props} />
        case "info":
            return <ModuleInfo {...props} />
        case "analytic_widgets":
            return <ModuleWidgets {...props} />
        case "roles":
            return <ModuleRoles {...props} />
        case "schedule":
            return <ModuleSchedule {...props} />
        /*  case "schedule_list":
             return <ModuleScheduleList {...props}/> */
        case "tabs":
            return <ModuleTabs {...props} />
        case "chat":
            return <ModuleChat {...props} />
        case "mini_chat":
            return <ModuleMiniChat {...props} />
        case "calendar":
            return <ModuleCalendar {...props} />
        case "documents":
            return <ModuleDocuments {...props} />
        case "funnel":
            return <ModuleFunnel {...props} />
        case "news":
            return <ModuleNews {...props} />
        case "logs":
            return <ModuleLogs {...props} />
        case "links_block":
            return <ModuleLinksBlock {...props} />
        case "app_editor":
            return <ModuleAppEditor {...props} />
        case "accordion":
            return <ModuleAccordion {...props} />
        case "day_planning":
            return <ModuleDayPlanning {...props} />
        case "queue":
            return <ModuleQueue {...props} />
        case "yandex_map":
            return <ModuleYandexMap {...props} />
        case "buttons":
            return <ModuleButtons {...props} />
        case "tariffs":
            return <ModuleTariffs {...props} />
        case "html_page":
            return <ModuleHtmlPage {...props} />
        default:
            //@ts-ignore
            return <ModuleInCreation {...props} />
    }
}

const getModuleKey = (module: ModuleType) => {
    switch (module.type) {
        case "header":
            return `${module.type}-${module.settings.title}`
        case "list":
            return `${module.type}-${module.settings.object}`
        case "analytic_widgets":
            return `${module.type}-${module.settings.widgets_group}`
        case "form":
        case "info":
            return `${module.type}-${module.settings.object}-${module.settings.command}`
        case "roles":
            return `${module.type}-${module.size}`
        default:
            //@ts-ignore
            return `${module.type}-uncreated`
    }
}

const PageBuilder: React.FC<TPageBuilder> = ({ data, isFetching, showProgressBar = true }) => {
    const { pathname } = useLocation()
    return <PageProvider>
        <div className={`pageBuilder_container${isFetching ? " loading" : ""}`}>
            {showProgressBar ? <PageProgressBar isFetching={isFetching} /> : null}
            {data?.map(module => {
                const uniqKey = pathname + getModuleKey(module)
                return <Form.Group className={`pageBuilder_module ${module.size === 4 ? "" : " withPaddings"}`} key={uniqKey} as={Col} md={module.size * 3}>
                    <Module {...module} />
                </Form.Group>
            })}
        </div>
    </PageProvider>
}

export default PageBuilder