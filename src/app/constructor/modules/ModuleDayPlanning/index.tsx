import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import moment from "moment"
import ComponentButton from "../../components/ComponentButton"
import { useFilter } from "../helpers"
import useDayPlanning from "../../../api/hooks/useDayPlanning"
import { getButtonKey } from "../ModuleList"
import useUpdate from "../../../api/hooks/useUpdate"
import { useIntl } from "react-intl"
import ComponentTooltip from "../../components/ComponentTooltip"
import ComponentModal from "../../components/ComponentModal"
import { TModuleDayPlanning, TModuleDayPlanningDate, TModuleDayPlanningLink, TModuleDayPlanningRow } from "./_types"
import { KTSVG } from "../../../../_metronic/helpers"

const ModuleDayPlanningLink = React.memo<TModuleDayPlanningLink>(props => {
    const handleClick = () => setSelectedPage(link)
    const { link, title, setSelectedPage } = props
    return <span
        key={title + link}
        className="moduleDayPlanning_rowLink"
        onClick={handleClick}>{title}</span>
})

const ModuleDayPlanningRow = React.memo<TModuleDayPlanningRow>(props => {
    const { body, color, links, description, time, buttons, setSelectedPage } = props
    return <div className="moduleDayPlanning_row">
       {/*  <span className={`moduleDayPlanning_rowBullet bullet bullet-vertical bg-${color}`} /> */}
        <ComponentTooltip title={description}>
            <div className="moduleDayPlanning_rowBody">
                <div className="moduleDayPlanning_rowProps">
                <div className={`moduleDayPlanning_rowTime ${color}`}>{time}</div>
                {description ? <KTSVG className={`moduleDayPlanning_alertIcon ${color}`} path="/media/crm/icons/alert.svg" /> : null}
                </div>
                <div className="moduleDayPlanning_rowLinks">{links.map(link => <ModuleDayPlanningLink link={link.link} title={link.title} setSelectedPage={setSelectedPage} />)}</div>
                <div className="moduleDayPlanning_rowContent">{body}</div>
            </div>
        </ComponentTooltip>
        <div className="moduleDayPlanning_rowButtons">
            {buttons?.map(button => <ComponentButton key={getButtonKey(button)} {...button} defaultLabel="icon" />)}
        </div>
    </div>
})

const ModuleDayPlanningDate = React.memo<TModuleDayPlanningDate>(({ date, filter, handleDateClick }) => {
    const isCurrentDate = filter.day === date.format("YYYY-MM-DD")
    return <div className={`moduleDayPlanning_date${isCurrentDate ? " active" : ""}`} onClick={event => {
        event.currentTarget.parentElement?.scrollTo({
            left: event.currentTarget.offsetLeft - event.currentTarget.parentElement.offsetWidth / 2,
            behavior: "smooth"
        })
        handleDateClick(date)
    }}>
        <span className="moduleDayPlanning_dateWeekDay">{date.format("dd").slice(0, 1).toUpperCase() + date.format("dd").slice(1)}</span>
        <span className="moduleDayPlanning_dateMonthDay">{date.format("DD.MM")}</span>
    </div>
})

const ModuleDayPlanning: React.FC<TModuleDayPlanning> = props => {
    const intl = useIntl()
    const { settings } = props
    const { object, links_property, time_from_property, time_to_property } = settings
    const [selectedPage, setSelectedPage] = useState<string | null>(null)
    const handleClose = useCallback((value: boolean | null) => {
        setSelectedPage(null)
    }, [])

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
        return new Array(29).fill(0).map((el, index) => {
            if (index < 14) {
               return moment().subtract(Math.abs(index + 1), 'days')
            } else if (index > 14) {
               return moment().add(index + 1, "days")
            } else {
               return moment()
            }
        })
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
    const { filter, setFilter } = useFilter(`${props.type}_${settings.object}`, filterInitials, "", ["day"])
    const { data, isFetching, refetch } = useDayPlanning(filter)
    const isEmptyDate = !isFetching && !data?.length

    //автообновление
    useUpdate([{ active: true, update: refetch }], "day_planning", 1000)


    const handleDateClick = useCallback((date: moment.Moment) => {
        const currentDate = date.format("YYYY-MM-DD")
        setFilter((prev: { day?: string }) => prev?.day === currentDate ? prev : { ...prev, day: currentDate })
    }, [])


    const datesContainerRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const containerRef = datesContainerRef.current
        if (containerRef) {
            containerRef.scrollTo({
                left: containerRef.scrollWidth / 2 - containerRef.offsetWidth / 2,
                behavior: "smooth"
            })
        }
    }, [])
    return <div className="moduleDayPlanning card">
        <div className="moduleDayPlanning_body card-body">
            <div ref={datesContainerRef} className="moduleDayPlanning_datesContainer">
                {dates.map(date => <ModuleDayPlanningDate key={date.format("YYYY-MM-DD")} date={date} filter={filter} handleDateClick={handleDateClick} />)}
            </div>
            <div className={`moduleDayPlanning_rowsContainer${isFetching ? " loading" : ""}`}>
                {data?.map(row => <ModuleDayPlanningRow key={row.id} {...row} setSelectedPage={setSelectedPage} />)}
                {isEmptyDate ? <div className="moduleDayPlanning_emptyList">{intl.formatMessage({ id: "DAY_PANNING.EMPTY_LIST" })}</div> : null}
            </div>
        </div>
        <ComponentModal page={selectedPage} show={Boolean(selectedPage)} setShow={handleClose} refresh={refetch} />
    </div>
}

export default ModuleDayPlanning