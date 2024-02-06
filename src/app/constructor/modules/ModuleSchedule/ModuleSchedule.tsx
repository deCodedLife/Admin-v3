import moment from "moment"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { Dropdown, Modal } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { KTSVG } from "../../../../_metronic/helpers"
import useSchedule from "../../../api/hooks/useSchedule"
import useScheduleForm from "../../../api/hooks/useScheduleForm"
import useUpdate from "../../../api/hooks/useUpdate"
import PageBuilder from "../../../page/PageBuilder"
import {
    ModuleScheduleCellType, ModuleScheduleComponentCellType, ModuleScheduleComponentColumnType,
    ModuleScheduleDateColumnType, ModuleScheduleModalType, ModuleScheduleScrollButtonsType,
    ModuleScheduleServerCellType, ModuleScheduleStepsColumnType, ModuleScheduleTableType, ModuleScheduleType
} from "../../../types/modules"
import ComponentFilters from "../../components/ComponentFilters"
import SplashScreen from "../../helpers/SplashScreen"
import { useFilter } from "../helpers"
import { useIntl } from "react-intl"
import setModalIndex from "../../helpers/setModalIndex"
import { ApiScheduleType } from "../../../types/api"

export const ModalContext = React.createContext<{[key: string]: any}>({})


const getEmployeeSchedule = (schedule: Array<ModuleScheduleServerCellType>, steps_list: Array<string>) => {
    return schedule.reduce<Array<ModuleScheduleCellType>>((acc, graph) => {
        const [start, end] = graph.steps 
        const currentSteps = steps_list.slice(start, end + 1)

        switch (graph.status) {
            case "busy":
                return acc.concat({
                    type: "busy",
                    time: currentSteps[0],
                    event: graph.event,
                    cell_height: end - start + 1
                })
            case "available":
                return acc.concat(currentSteps.map(step => ({
                    type: "available",
                    time: step,
                    cell_height: 1,
                    initials: graph.initials
                })))
            default:
                return acc.concat(currentSteps.map(step => ({
                    type: "disabled",
                    time: step,
                    cell_height: 1
                })))
        }
    }, [])
}
const getScheduleAsArray = (data?: ApiScheduleType) => {
    if (data && data.schedule) {
        const { schedule, steps_list } = data
        return Object.entries(schedule).map(([header, body]) => ({
            header,
            body: body ? Object.values(body).map(employee => ({
                ...employee,
                schedule: getEmployeeSchedule(employee.schedule, steps_list)
            })).sort((currentEmployee, previousEmployee) => {
                return currentEmployee.performer_title > previousEmployee.performer_title ? 1 : -1
            }) : []
        }))
    }
    else {
        return []
    }
}

const ModuleScheduleCell: React.FC<ModuleScheduleComponentCellType> = (props) => {
    const { type, date, time, cell_height, event, initials, innerInitials, setSelectedCell,  } = props
    const currentCellHeight = `${3.15 * cell_height + 0.5 * (cell_height - 1)}rem`
    const leftResolvedIcons = event && Array.isArray(event.icons) ? event.icons.length > 2 ? event.icons.slice(0,2) : [] : []
    const rightResolvedIcons = event && Array.isArray(event.icons) ? event.icons.length > 2 ? event.icons.slice(2,4) : event.icons.slice(0,2) : []

    const handleClick = () => {
        if (type === "disabled") {
            return
        } else {
            return setSelectedCell({
                type,
                date,
                time,
                event,
                initials: Object.assign({}, initials, innerInitials ?? {})
            })
        }
    }
    if (type === "busy") {
        if (event) {
            return <div className="moduleSchedule_cellContainer" onClick={handleClick}>
                <div className="card card-custom overlay cell-overlay">
                    <div className="card-body p-0">
                        <div className="overlay-wrapper moduleSchedule_cellWrapper">
                            <div className={`moduleSchedule_cell ${type} ${event?.color}`} style={{ height: currentCellHeight }}>
                                <div className={`moduleSchedule_cellContentContainer ${cell_height === 1 ? " minimize" : ""}`}>
                                <div className="moduleSchedule_cellIcons left">
                                        {leftResolvedIcons.map((icon: string) => <KTSVG key={icon} path={`/media/crm/icons/${icon}.svg`} className='moduleSchedule_cellIcon' />)}
                                    </div>
                                    {Array.isArray(event.description) ? event.description.map((descriptionRow: string) => {
                                        return <div key={descriptionRow} className="moduleSchedule_cellContent">
                                            <span className="moduleSchedule_cellValue">{descriptionRow}</span>
                                        </div>
                                    }) : null}
                                    <div className="moduleSchedule_cellIcons right">
                                    {rightResolvedIcons.map((icon: string) => <KTSVG key={icon} path={`/media/crm/icons/${icon}.svg`} className='moduleSchedule_cellIcon' />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overlay-layer moduleSchedule_cellOverlay">
                            <div className={`moduleSchedule_cell ${type} ${event?.color}`} style={{ height: currentCellHeight }}>
                                <div className="moduleSchedule_cellContentContainer">
                                    {Array.isArray(event.details) ? event.details.map((detailRow: { icon: string, value: string }) => <div key={detailRow.value} className="moduleSchedule_cellContent">
                                        <span className="moduleSchedule_cellValue">{detailRow.value}</span></div>) : null}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } else {
            return <div className="moduleSchedule_cellContainer">
                <div className="card card-custom">
                    <div className="card-body p-0">
                        <div className="overlay-wrapper moduleSchedule_cellWrapper">
                            <div className="moduleSchedule_cell busy danger" style={{ height: currentCellHeight }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

    }
    return <div className="moduleSchedule_cellContainer" onClick={handleClick}>
        <div className={`moduleSchedule_cell ${type}`} style={{ height: currentCellHeight }} />
    </div>
}
const ModuleScheduleColumn: React.FC<ModuleScheduleComponentColumnType> = (props) => {
    const { performer_title, performer_href, schedule, date, initials, setSelectedCell } = props

    return <div className="moduleSchedule_employeeColumn">
        <a href={performer_href ?? ""} target="_blank">
            <div className="moduleSchedule_employeeColumnHeader">
                <span className="moduleSchedule_employeeColumnTitle">{performer_title}</span>
            </div>
        </a>

        {schedule.map(cell => <ModuleScheduleCell
            key={`${cell.time}-${cell.type}`}
            type={cell.type}
            date={date}
            time={cell.time}
            cell_height={cell.cell_height}
            event={cell.event}
            initials={initials}
            innerInitials={cell.initials}
            setSelectedCell={setSelectedCell}
        />)}
    </div>
}
const ModuleScheduleDateColumn: React.FC<ModuleScheduleDateColumnType> = ({ date, body, setSelectedCell }) => {
    const dayAsWord = moment(date).format("dddd").toLocaleUpperCase().slice(0, 1) + moment(date).format("dddd").toLowerCase().slice(1)
    const dayAsDate = moment(date).format("DD MMMM")
    const currentFormatDate = `${dayAsWord}, ${dayAsDate}`
    return <div className="moduleSchedule_dateColumn">
        <div className="moduleSchedule_dateColumnHeader">
            <span className="moduleSchedule_dateColumnContent">{currentFormatDate}</span>
        </div>
        <div className="moduleSchedule_dateColumnBody">
            {body.map(item => <ModuleScheduleColumn
                key={item.performer_title + item.performer_href}
                date={date}
                performer_title={item.performer_title}
                schedule={item.schedule}
                performer_href={item.performer_href}
                initials={item.initials}
                setSelectedCell={setSelectedCell}
            />)}
        </div>
    </div>
}
const ModuleScheduleStepsColumn: React.FC<ModuleScheduleStepsColumnType> = ({ steps, setFilter }) => {
    const intl = useIntl()
    const [selectedStep, setSelectedStep] = useState(60)

    const stepsForSelect = useMemo(() => {
        return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
    }, [])

    const setStep = useCallback((step: number) => {
        setFilter((previousFilter: any) => {
            return {
                ...previousFilter,
                step
            }
        })
        setSelectedStep(step)
    }, [])

    return <div className="moduleSchedule_steps">
        <Dropdown className="moduleSchedule_stepsDropdown">
            <Dropdown.Toggle id="moduleSchedule_stepsButton">
                {intl.formatMessage({ id: "SCHEDULE.STEPS_TITLE" })}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {stepsForSelect.map(stepForSelect => (
                    <Dropdown.Item
                        key={stepForSelect}
                        className={`moduleSchedule_filterStep${selectedStep === stepForSelect ? " selected" : ""}`}
                        onClick={() => setStep(stepForSelect)}
                    >{stepForSelect}
                    </Dropdown.Item>)
                )}
            </Dropdown.Menu>
        </Dropdown>
        {steps.map(step => <div key={step} className="moduleSchedule_stepsCell">{step}</div>)}
    </div>
}
const ModuleScheduleTable = React.memo<ModuleScheduleTableType>(({ steps, schedule, tableRef, setSelectedCell, setFilter }) => {
    return <div className="moduleSchedule_table" ref={tableRef}>
        <div className="moduleSchedule_columns">
            <ModuleScheduleStepsColumn steps={steps} setFilter={setFilter} />
            {schedule.map(day => <ModuleScheduleDateColumn key={day.header} date={day.header} body={day.body} setSelectedCell={setSelectedCell} />)}
        </div>
    </div>
})
const ModuleScheduleScrollButtons = React.memo<ModuleScheduleScrollButtonsType>(({ scrollTable }) => {
    return <div className="moduleSchedule_scrollButtons">
        <div className="moduleSchedule_scrollButtonContainer left">
            <button className="moduleSchedule_scrollButton" type="button" onClick={() => scrollTable(-1)}>
                <KTSVG path="/media/icons/duotune/arrows/arr022.svg" />
            </button>
        </div>
        <div className="moduleSchedule_scrollButtonContainer right">
            <button className="moduleSchedule_scrollButton" type="button" onClick={() => scrollTable(1)}>
                <KTSVG path="/media/icons/duotune/arrows/arr023.svg" />
            </button>
        </div>
    </div>
})
const ModuleScheduleModalForm = React.memo<ModuleScheduleModalType>(({ requestObject, selectedCell, setSelectedCell }) => {
    const { data, isFetching } = useScheduleForm(requestObject, selectedCell)
    const navigate = useNavigate()
    const location = useLocation()
    const modalContext = useMemo(() => {
        return Object.assign({ setShow: setSelectedCell }, selectedCell ? {
            initialData: {
                id: selectedCell.event?.id ?? undefined,
                start_at: `${selectedCell.date} ${selectedCell.time}:00`,
                end_at: `${selectedCell.date} ${selectedCell.time}:00`,
                ...selectedCell.initials
            },
            insideModal: true
        } : {})
    }, [selectedCell])

    return <Modal
        size="xl"
        dialogClassName="customModal moduleSchedule_modal"
        show={Boolean(selectedCell) && Boolean(data)}
        onHide={() => setSelectedCell(null)}
        onEntering={setModalIndex}
        onEntered={() => navigate(`?modal=${requestObject}${selectedCell?.event?.id ? `&id=${selectedCell.event.id}` : ""}`)}
        onExited={() => navigate(location.pathname)}
    >
        <Modal.Header closeButton className="modal-emptyHeader" />
        <Modal.Body className="scroll-y">
            <ModalContext.Provider value={modalContext}>
                {data ? <PageBuilder data={data} isFetching={isFetching} showProgressBar={false} /> : null}
            </ModalContext.Provider>

        </Modal.Body>
    </Modal>
})
const ModuleSchedule: React.FC<ModuleScheduleType> = (props) => {
    const { components, settings } = props
    const { object, filters } = settings
    const { filter, isInitials, setFilter, resetFilter } = useFilter(`${props.type}_${settings.object}`, filters, "", ["start_at"] )
    const [selectedCell, setSelectedCell] = useState<any>(null)
    const haveFilter = Boolean(components?.filters)

    const { data, isLoading: loading, isFetching, refetch } = useSchedule(object, filter)
    const schedule = useMemo(() => getScheduleAsArray(data), [data])
    useUpdate([{ active: true, update: refetch }], "schedule", 1000)

    const tableRef = useRef<HTMLDivElement | null>(null)

    const scrollTable = useCallback((direction = 1) => {
        if (tableRef.current) {
            const currentTableXPosition = tableRef.current.scrollLeft + tableRef.current.clientWidth / 2 * direction
            tableRef.current.scrollTo({
                left: currentTableXPosition,
                behavior: "smooth"
            })
        }
    }, [tableRef])

    return <>
        {haveFilter ? <ComponentFilters
            type="string"
            data={components.filters}
            filterValues={filter}
            isInitials={isInitials}
            handleChange={setFilter}
            handleReset={resetFilter}
        /> : null}
        <div className={`moduleSchedule card${isFetching ? " loading" : ""}`}>
            <ModuleScheduleScrollButtons scrollTable={scrollTable} />
            <ModuleScheduleTable steps={data?.steps_list ?? []} schedule={schedule} tableRef={tableRef} setSelectedCell={setSelectedCell} setFilter={setFilter} />
            <SplashScreen active={loading} />
        </div>
        <ModuleScheduleModalForm requestObject={object} selectedCell={selectedCell} setSelectedCell={setSelectedCell} />
    </>

}

export default ModuleSchedule