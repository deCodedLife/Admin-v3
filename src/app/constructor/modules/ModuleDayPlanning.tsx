import React, { useCallback, useMemo } from "react"
import { ModuleDayPlanningDateType, ModuleDayPlanningRowType, ModuleDayPlanningType } from "../../types/modules"
import moment from "moment"
import ComponentButton from "../components/ComponentButton"
import { useFilter } from "./helpers"
import useDayPlanning from "../../api/hooks/useDayPlanning"
import { getButtonKey } from "./ModuleList/ModuleList"
import useUpdate from "../../api/hooks/useUpdate"
import { useIntl } from "react-intl"
import ComponentTooltip from "../components/ComponentTooltip"

const ModuleDayPlanningRow = React.memo<ModuleDayPlanningRowType>(({ body, color, links, description, time, buttons }) => {
    return <div className="moduleDayPlanning_row">
        <ComponentTooltip title={description}>
            <span className={`moduleDayPlanning_rowBullet bullet bullet-vertical bg-${color}`} />
        </ComponentTooltip>
        <div className="moduleDayPlanning_rowBody">
            <div className="moduleDayPlanning_rowTime">{time}</div>
            <div className="moduleDayPlanning_rowContent">{body}</div>
            <div className="moduleDayPlanning_rowLinks">{links.map(link => <a
                key={link.title + link.link}
                className="moduleDayPlanning_rowLink"
                href={link.link}
                target="_blank">{link.title}</a>)}</div>
        </div>
        <div className="moduleDayPlanning_rowButtons">
            {buttons?.map(button => <ComponentButton key={getButtonKey(button)} {...button} defaultLabel="icon" />)}
        </div>
    </div>
})

const ModuleDayPlanningDate = React.memo<ModuleDayPlanningDateType>(({ date, filter, handleDateClick }) => {
    const isCurrentDate = filter.day === date.format("YYYY-MM-DD")
    return <div className={`moduleDayPlanning_date${isCurrentDate ? " active" : ""}`} onClick={() => handleDateClick(date)}>
        <span className="moduleDayPlanning_dateWeekDay">{date.format("dd").slice(0, 1).toUpperCase() + date.format("dd").slice(1)}</span>
        <span className="moduleDayPlanning_dateMonthDay">{date.format("DD.MM")}</span>
    </div>
})

const ModuleDayPlanning: React.FC<ModuleDayPlanningType> = (props) => {
    const intl = useIntl()
    const { settings } = props
    const { object, links_property, time_from_property, time_to_property } = settings

    //спектр выводимых дат под фильтр
    const dates = useMemo(() => {
        const datesArray = []
        for (let i = -7; i <= 7; i++) {
            if (i < 0) {
                datesArray.push(moment().subtract(Math.abs(i), 'days'))
            } else if (i > 0) {
                datesArray.push(moment().add(i, "days"))
            } else {
                datesArray.push(moment())
            }
        }
        return datesArray
    }, [])

    //фильтрация и запрос
    const filterInitials = useMemo(() => ({
        context: { block: "day_planning" },
        object,
        links_property,
        time_from_property,
        time_to_property,
        day: moment().format("YYYY-MM-DD")
    }), [])
    const { filter, setFilter } = useFilter(`${props.type}_${settings.object}`, filterInitials)
    const { data, isFetching, refetch } = useDayPlanning(filter)
    const isEmptyDate = !isFetching && !data?.length

    //автообновление
    useUpdate([{ active: true, update: refetch }], "day_planning", 1000)


    const handleDateClick = useCallback((date: moment.Moment) => {
        const currentDate = date.format("YYYY-MM-DD")
        setFilter((prev: { day?: string }) => prev?.day === currentDate ? prev : {...prev, day: currentDate })
    }, [])


    return <div className="moduleDayPlanning card">
        <div className="moduleDayPlanning_body card-body">
            <div className="moduleDayPlanning_datesContainer">
                {dates.map(date => <ModuleDayPlanningDate key={date.format("YYYY-MM-DD")} date={date} filter={filter} handleDateClick={handleDateClick} />)}
            </div>
            <div className={`moduleDayPlanning_rowsContainer${isFetching ? " loading" : ""}`}>
                {data?.map(row => <ModuleDayPlanningRow key={row.id}  {...row} />)}
                {isEmptyDate ? <div className="moduleDayPlanning_emptyList">{intl.formatMessage({ id: "DAY_PANNING.EMPTY_LIST" })}</div> : null}
            </div>
        </div>
    </div>
}

export default ModuleDayPlanning