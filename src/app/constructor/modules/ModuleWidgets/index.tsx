import React from "react"
import { Col, Form } from "react-bootstrap"
import useWidget from "../../../api/hooks/useWidget"
import ComponentDashboard from "../../components/ComponentDashboard"
import ComponentFilters from "../../components/ComponentFilters"
import { KTSVG } from "../../../../_metronic/helpers"
import ProgressBarModule from "./src/ProgressBar"
import CharModule from "./src/Char"
import DonutModule from "./src/Donut"
import { useFilter } from "../helpers"
import { useIntl } from "react-intl"
import ComponentTooltip from "../../components/ComponentTooltip"
import useUpdate from "../../../api/hooks/useUpdate"
import SplashScreen from "../../helpers/SplashScreen"
import ComponentButton from "../../components/ComponentButton"
import moment from "moment"
import api from "../../../api"
import { useRefetchSubscribers, useSubscribeOnRefetch } from "../helpers/PageContext"
import {
    TModuleWidgets,
    TModuleWidgetsHardReport, TModuleWidgetsSimpleReport,
    TModuleWidgetsToolbar,
    TModuleWidgetsWidget,
    TModuleWidgetsWidgetGraphModule
} from "./_types";


const WidgetGraphModule: React.FC<TModuleWidgetsWidgetGraphModule> = ({ detail }) => {
    const intl = useIntl()
    const { type, settings } = detail
    switch (type) {
        case "progress_bar":
            return <ProgressBarModule title={settings.title} percent={settings.percent} />
        case "char":
        case "details_char":
            return <CharModule char={settings.char} withDetails={type === "details_char"} value_title={settings.value_title} />
        case "donut":
            return <DonutModule char={settings.char} />
        default:
            return <div className="card-body">
                <div className='d-flex flex-column w-100'>
                    <span className='text-dark me-2 fw-bold pb-3'>{`${intl.formatMessage({ id: "WIDGET.UNDEFINDED_MODULE" })} ${type}`}</span>
                </div>
            </div>
    }
}

const Widget: React.FC<TModuleWidgetsWidget> = ({ data }) => {
    const { prefix, value, postfix, description, detail, size = 2 } = data
    const havePostifx = !Array.isArray(postfix) && postfix.value
    const haveGraphModule = !Array.isArray(detail)
    const widgetSize = size * 3
    return <Form.Group className="moduleWidgets_widgetContainer" as={Col} md={widgetSize}>

        <div className="moduleWidgets_widget card card-flush">
            <div className="moduleWidgets_widgetContent card-header">
                <div className='card-title flex-column mw-100'>
                    <div className="moduleWidgets_widgetValueContainer">
                        <span className="moduleWidgets_widgetValuePrefix">{prefix}</span>
                        <ComponentTooltip title={value}>
                            <span className="moduleWidgets_widgetValue">{value}</span>
                        </ComponentTooltip>
                        {
                            havePostifx ? <span className={`badge badge-light-${postfix?.background ?? "success"} fs-base`}>
                                {postfix?.icon ? <KTSVG
                                    path='/media/icons/duotune/arrows/arr066.svg'
                                    className='svg-icon-5 svg-icon-success ms-n1'
                                /> : null}
                                {' '}
                                {postfix?.value}
                            </span> : null
                        }
                    </div>
                    <span className='moduleWidgets_widgetDescription'>{description}</span>
                </div>
            </div>
            {haveGraphModule ? <WidgetGraphModule detail={detail} /> : null}
        </div>

    </Form.Group>
}
const ModuleWidgetsSimpleReport: React.FC<TModuleWidgetsSimpleReport> = ({ data }) => {
    return <>
        {data.map(widget => <Widget key={widget.description + widget.value} data={widget} />)}
    </>
}
const ModuleWidgetsHardReport: React.FC<TModuleWidgetsHardReport> = ({ data }) => {
    const { report, status } = data
    return <div className="moduleWidgets_hardReportContainer">
        {status === "no_cache" ? <div className="moduleWidgets_infoCard">
            <span>По данному отчёту еще не запрашивалась информация. Пожалуйста, нажмите на кнопку "Обновить отчёт".</span>
        </div> :
            status === "updating" ? <div className="moduleWidgets_infoCard">
                <span>Отчёт в процессе формирования. Пожалуйста, ожидайте.</span>
            </div> :
                report?.map(widget => <Widget key={widget.description + widget.value} data={widget} />)}
    </div>
}
const ModuleWidgetsToolbar: React.FC<TModuleWidgetsToolbar> = props => {
    const { updated_at, status, handleUpdateHardReport } = props
    const resolvedUpdateTime = updated_at ? moment(updated_at).format("DD.MM.YY г. HH:mm") : "-"
    const isButtonDisabled = status === "updating"
    return <div className="moduleWidgets_toolbar">
        <div className="moduleWidgets_updateTime">{`Последнее обновление: ${resolvedUpdateTime}`}</div>
        <ComponentButton type="custom" settings={{ title: "Обновить отчёт", background: "dark", icon: "" }} customHandler={handleUpdateHardReport} disabled={isButtonDisabled} />
    </div>
}

const ModuleWidgets = React.memo<TModuleWidgets>(props => {
    const { components, settings, hook } = props
    const { widgets_group: widgetCommand, filters: initialFilters, linked_filter } = settings
    const { filter, isInitials, setFilter, resetFilter } = useFilter(`${props.type}_${widgetCommand}`, initialFilters, linked_filter)
    const haveFilter = Boolean(components?.filters)
    const haveButtons = Boolean(components?.buttons)
    const { data, isLoading, isRefetching, refetch } = useWidget(widgetCommand, filter)
    
    useSubscribeOnRefetch(refetch, setFilter, linked_filter)

    useRefetchSubscribers(`${props.type}_${widgetCommand}`, isRefetching, Boolean(linked_filter), filter)
   

    useUpdate([{ active: Boolean(hook), update: refetch }], hook, 1000)
    const showToolbar = data && !Array.isArray(data)
    const handleUpdateHardReport = async () => {
        await api("hardReports", "add", { reportArticle: widgetCommand, filters: filter })
        setTimeout(refetch, 1000)
    }
    return <div className="moduleWidgets">
        {
            haveButtons || haveFilter ?
                <ComponentDashboard>
                    {haveButtons ? components.buttons.map(button => <ComponentButton key={button.settings.title} className="dark-light" {...button} />) : null}
                    {haveFilter ? <ComponentFilters
                        type="dropdown"
                        data={components.filters}
                        filterValues={filter}
                        isInitials={isInitials}
                        handleChange={setFilter}
                        handleReset={resetFilter}
                    /> : null}
                </ComponentDashboard> : null
        }

        {showToolbar ? <ModuleWidgetsToolbar updated_at={data.updated_at} status={data.status} handleUpdateHardReport={handleUpdateHardReport} /> : null}
        <SplashScreen active={isLoading} />
        {data ? Array.isArray(data) ? <ModuleWidgetsSimpleReport data={data} /> : <ModuleWidgetsHardReport data={data} /> : null}
    </div>
})

export default ModuleWidgets