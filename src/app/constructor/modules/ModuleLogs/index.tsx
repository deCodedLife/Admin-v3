import moment from "moment"
import React, { useMemo } from "react"
import { useLocation } from "react-router-dom"
import { KTSVG } from "../../../../_metronic/helpers"
import useItem from "../../../api/hooks/useItem"
import { TModuleLogsLog, TModuleLogs } from "./_types"
import { useIntl } from "react-intl"
import { useFilter } from "../helpers"
import ComponentDashboard from "../../components/ComponentDashboard"
import ComponentFilters from "../../components/ComponentFilters"
import SplashScreen from "../../helpers/SplashScreen"

const LogItem: React.FC<TModuleLogsLog> = (props) => {
    const intl = useIntl()
    const { description, created_at, users_id, status, table_name, ip } = props
    const getIcon = (status: string) => {
        switch (status) {
            default:
                return "info"
        }
    }
    return <li className="moduleLogs_log">
        <div className="moduleLogs_logTimeline" />
        <div className="moduleLogs_logIcon">
            <KTSVG path={`/media/crm/icons/${getIcon(status)}.svg`} className=' svg-icon-1' />
        </div>
        <div className="moduleLogs_logContent">
            <div className="moduleLogs_logProperties">
            <span className={`moduleLogs_logBadge badge badge-secondary`}>{`${table_name}`}</span>
            <div className="moduleLogs_logDate">{moment(created_at).format("DD MMM YYYY г. HH:mm")}</div>
            </div>
            <div className="moduleLogs_logDescription">
                {description}
            </div>
            <div className="moduleLogs_logProperties">
                <div className="moduleLogs_logAuthors">
                {Array.isArray(users_id) ?
                <a
                className="moduleLogs_logAuthor"
                href={`/users/update/${users_id[0].value}`}
                target="_blank">{`${users_id[0].title}`}</a>
                     : intl.formatMessage({ id: "LOGS.DEFAULT_AUTHOR_NAME" })}
                </div>
                <div className="moduleLogs_logAuthorIp">{`(ip: ${ip})`}</div>
            </div>
        </div>
    </li>
}

const ModuleLogs: React.FC<TModuleLogs> = ({ type, components, settings }) => {
    const intl = useIntl()
    const { object, filters } = settings
    const { pathname } = useLocation()
    const pathAsArray = pathname.split("/")
    const potentialId = Number(pathAsArray[pathAsArray.length - 1])
    const resolvedFilters = useMemo(() => {
        if (Array.isArray(filters)) {
            return filters.reduce((acc, filter) => {
                const resolvedValue = filter?.value.includes("id") ? Number.isInteger(potentialId) ? potentialId : null : filter.value
                return Object.assign({}, acc, { [filter.property]: resolvedValue })
            }, {})
        } else {
            return filters
        }
    }, [filters])
    const resolvedInitialFilterValues = useMemo(() => ({ context: {block: "logs"}, ...resolvedFilters }), [resolvedFilters])
    const { filter, isInitials, setFilter, resetFilter } = useFilter(`${type}_${settings.object}`, resolvedInitialFilterValues)
    const { data, isLoading: loading } = useItem<Array<TModuleLogsLog>>(object, filter)
    const isEmptyData = !loading && data?.length === 0
    const haveFilter = Boolean(components?.filters)
    return <>
        <ComponentDashboard>
            {haveFilter ? <ComponentFilters 
            type="dropdown" 
            data={components.filters}
             filterValues={filter} 
             isInitials={isInitials}
             handleChange={setFilter} 
             handleReset={resetFilter}
             /> : null}
        </ComponentDashboard>
        <div className="moduleLogs card">
            <div className="card-body">
                <SplashScreen active={loading} />
                {isEmptyData ? <div className="moduleLogs_emptyList">{intl.formatMessage({ id: "LOGS.EMPTY_LOGS_LIST" })}</div> : null}
                {Array.isArray(data) ? <ul className="moduleLogs_logsList">
                    {data.map(log => <LogItem key={log.id} {...log} />)}
                </ul> : null}
            </div>
        </div>
    </>
}


export default ModuleLogs