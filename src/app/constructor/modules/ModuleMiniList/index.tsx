import moment from "moment"
import React, { useCallback, useMemo } from "react"
import ComponentFilters from "../../components/ComponentFilters"
import { TModuleMiniList, TModuleMiniListCell, TModuleMiniListMonth } from "./_types"
import { getMaskedString, useFilter } from "../helpers"
import useListData from "../../../api/hooks/useListData"
import { useRefetchSubscribers, useSubscribeOnRefetch } from "../helpers/PageContext"
import useUpdate from "../../../api/hooks/useUpdate"
import { TApiSetup } from "../../../types/api"
import { useSetupContext } from "../../helpers/SetupContext"
import ComponentTooltip from "../../components/ComponentTooltip"


/* const data = [
    {
        title: "Рабочих дней",
        current_value: { direction: "positive", value: "14" },
        previous_value: "12"
    },
    {
        title: "Пациентов",
        current_value: { direction: "negative", value: "2" },
        previous_value: "31"
    },
    {
        title: "Сумма",
        current_value: { direction: "negative", value: "10000", suffix: "₽" },
        previous_value: { value: "15000", suffix: "₽" }
    },
]

const headers = [
    {
        "title": "",
        "article": "title",
        "type": "string"
    },
    {
        "title": "Текущий месяц",
        "article": "current_value",
        "type": "progress"
    },
    {
        "title": "Прошлый месяц",
        "article": "previous_value",
        "type": "number"
    }
] */

const ModuleMiniListCell = React.memo<TModuleMiniListCell>(props => {
    const { title, containerClassName, value } = props
    return <td>
        <ComponentTooltip title={title}>
            <span className={containerClassName}>{value}</span>
        </ComponentTooltip>
    </td>
})

const ModuleMiniListMonth: React.FC<TModuleMiniListMonth> = props => {
    const { index, month, isActive, handleMonthClick } = props
    return <div
        className={`moduleMiniList_nativeFilterButton${isActive ? " active" : ""}`}
        onClick={(event) => {
            event.currentTarget.parentElement?.scrollTo({
                left: event.currentTarget.offsetLeft + event.currentTarget.clientWidth / 4 - event.currentTarget.parentElement.offsetWidth / 2,
                behavior: "smooth"
            })
            handleMonthClick(index + 1)
        }}>
        {month}
    </div>
}

const getValueContainerClassName = (type: string, value: any) => {
    switch (type) {
        case "progress":
            return `moduleMiniList_value progressive ${value?.direction}`
        default:
            return `moduleMiniList_value ${type}`
    }
}

const parseValue = (type: string, value: any, context: TApiSetup) => {
    switch (type) {
        case "progress":
            return getMaskedString(value.value, "float", context, value?.suffix)
        case "integer":
        case "float":
            return getMaskedString(value?.value ?? value, type, context, value?.suffix)
        case "price":
            return getMaskedString(value?.value ?? value, "float", context)
        default:
            return value?.value ?? value
    }
}

const ModuleMiniList = React.memo<TModuleMiniList>(props => {
    const { components, settings, hook } = props
    const { context: setupContext } = useSetupContext()
    const { headers, filters: initialFilters, context: initialContext, linked_filter } = settings
    const resolvedMonthsArray = useMemo(() => {
        return moment.months().map(month => month.slice(0, 1).toUpperCase() + month.slice(1))
    }, [])


    //блок фильтров
    const haveFilter = Boolean(components?.filters)
    const resolvedInitialFilters = Object.assign({}, initialFilters, { month: moment().format("YYYY-MM-01") })
    const { filter, isInitials, setFilter, resetFilter } = useFilter(`${props.type}_${settings.object}`, resolvedInitialFilters, linked_filter)
    const context = Object.assign({}, { block: "mini_list" }, initialContext ?? {})
    const resolvedFilter = { context, ...filter }
    const { data: response, isLoading: loading, isFetching, isRefetching, refetch } = useListData(settings.object, resolvedFilter)

    useSubscribeOnRefetch(refetch, linked_filter)

    useRefetchSubscribers(`${props.type}_${settings.object}`, isRefetching, Boolean(linked_filter))

    //проверка обновления при наличии хука 
    useUpdate([{ active: Boolean(hook), update: refetch }], hook, 1000)

    const handleMonthClick = useCallback((monthIndex: number) => {
        const currentMonth = moment(monthIndex, "M").format("YYYY-MM-DD")
        setFilter((prev: { month?: string }) => prev?.month === currentMonth ? prev : { ...prev, month: currentMonth })
    }, [])


    return <div className="moduleMiniList card card-flush">
        <div className="card-header pt-5 mb-6">
            <div className="moduleMiniList_filtersContainer">
                {haveFilter ? <ComponentFilters
                    type="dropdown"
                    data={components.filters}
                    filterValues={filter}
                    isInitials={isInitials}
                    handleChange={setFilter}
                    handleReset={resetFilter}
                    minimize
                /> : null}
            </div>

            <div className="moduleMiniList_nativeFilter">
                {resolvedMonthsArray.map((month, index) => <ModuleMiniListMonth
                    key={month}
                    month={month}
                    index={index}
                    isActive={Number(moment(filter.month).format("M")) === index + 1}
                    handleMonthClick={handleMonthClick}
                />)}
            </div>
        </div>
        <div className="card-body">
            <div className="table-responsive">
                <table className='table table-row-gray-300 align-middle gs-0 gy-4'>

                    <tbody>
                        {response?.data.map(row => {
                            return <tr>
                                {headers?.map(column => <ModuleMiniListCell
                                    key={column.article}
                                    title={column.title}
                                    containerClassName={getValueContainerClassName(column.type, row[column.article])}
                                    value={parseValue(column.type, row[column.article], setupContext)}
                                />)}
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
})

export default ModuleMiniList