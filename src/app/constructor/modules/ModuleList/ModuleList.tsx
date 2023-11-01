import clsx from "clsx"
import { Formik, Form as FormikForm, useFormikContext } from "formik"
import moment from "moment"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Modal } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import useListData from "../../../api/hooks/useListData"
import useMutate from "../../../api/hooks/useMutate"
import useRequest from "../../../api/hooks/useRequest"
import useSearchRequest from "../../../api/hooks/useSearchRequest"
import { ComponentButtonType } from "../../../types/components"
import {
    ModuleListActionButtonsType, ModuleListCellType, ModuleListDownloaderType, ModuleListHeaderCellType,
    ModuleListPaginationType, ModuleListRowType, ModuleListType, ModuleListUpdateFieldType, ModuleListUpdateModalType
} from "../../../types/modules"
import ComponentButton from "../../components/ComponentButton"
import ComponentCheckbox from "../../components/ComponentCheckbox"
import ComponentDate from "../../components/ComponentDate"
import ComponentFilters from "../../components/ComponentFilters"
import ComponentInCreation from "../../components/ComponentInCreation"
import ComponentInput from "../../components/ComponentInput"
import ComponentPhone from "../../components/ComponentPhone"
import ComponentPrice from "../../components/ComponentPrice"
import ComponentSearch from "../../components/ComponentSearch"
import ComponentSelect from "../../components/ComponentSelect"
import ComponentTextarea from "../../components/ComponentTextarea"
import { checkDatesInString, getDateFormat, getMaskedString, useFilter, useSearch } from "../helpers"
import Select from "react-select"
import { KTSVG } from "../../../../_metronic/helpers"
import { useIntl } from "react-intl"
import api, { fileApi } from "../../../api"
import SkeletonRows from "./SkeletonRows"
import useLoading from "../../components/helpers/hooks/useLoading"
import { getErrorToast } from "../../helpers/toasts"
import { ModuleContext } from "../helpers/useModuleContent"
import ComponentDropdown from "../../components/ComponentDropdown"
import ComponentAudio from "../../components/ComponentAudio"
import { useSetupContext } from "../../helpers/SetupContext"
import useUpdate from "../../../api/hooks/useUpdate"
import setModalIndex from "../../helpers/setModalIndex"
import usePrevious from "../../helpers/usePrevious"
import { isEqual } from "lodash"
import { useRefetchSubscribers, useSubscribeOnRefetch } from "../helpers/PageContext"

export const getButtonKey = (button: ComponentButtonType) => `${button.type}-${button.settings.title}-${button.settings.icon}`

const DownloaderModule: React.FC<ModuleListDownloaderType> = ({ title, handleDownload, columns }) => {
    const intl = useIntl()
    const [showModal, setShowModal] = useState(false)
    const handleSubmit = async (selectedColumns: Array<string>) => {
        await handleDownload(selectedColumns)
        setShowModal(false)
    }
    return <div>
        <ComponentButton
            className="moduleList_downloaderModuleButton"
            type="custom"
            settings={{ title, icon: "download", background: "light" }}
            customHandler={() => setShowModal(true)}
        />
        <Modal show={showModal} onHide={() => setShowModal(false)} onEntering={setModalIndex}>
            <Formik initialValues={{
                select: [] as Array<string>
            }}
                onSubmit={values => handleSubmit(values.select)}>
                {({ values, setFieldValue, handleSubmit }) => <FormikForm>
                    <Modal.Header>
                        <Modal.Title>{intl.formatMessage({ id: "LIST.DOWNLOADER_MODAL_TITLE" })}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {columns.map(column => <ComponentCheckbox
                            key={column.article}
                            className="moduleList_downloaderModuleCheckbox"
                            customChecked={values.select.includes(column.article)}
                            customHandler={() => {
                                const selectedColumnsClone = [...values.select]
                                if (selectedColumnsClone.includes(column.article)) {
                                    const currentArticleIndex = selectedColumnsClone.indexOf(column.article)
                                    selectedColumnsClone.splice(currentArticleIndex, 1)
                                } else {
                                    selectedColumnsClone.push(column.article)
                                }
                                setFieldValue("select", selectedColumnsClone)
                            }}
                            label={column.title}
                        />)}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="componentButton_container">
                            <ComponentButton
                                type="submit"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.CANCEL" }), background: "light", icon: "" }}
                                customHandler={() => setShowModal(false)}
                            />
                            <ComponentButton
                                type="submit"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.SUBMIT" }), background: "dark", icon: "" }}
                                customHandler={handleSubmit}
                                disabled={!values.select.length}
                            />
                        </div>
                    </Modal.Footer>
                </FormikForm>}
            </Formik>
        </Modal>
    </div>
}


const ModuleListActionButtons: React.FC<ModuleListActionButtonsType> = ({ data }) => {
    const showActionsAsDropdown = Array.isArray(data) && data.length >= 4
    return <div className="moduleList_buttonsContainer">
        {showActionsAsDropdown ? <ComponentDropdown buttons={data} /> :
            data?.map(button => <ComponentButton key={getButtonKey(button)} {...button} defaultLabel="icon" className="moduleList_actionButton" />)}
    </div>
}

const Field: React.FC<ModuleListUpdateFieldType> = (props) => {
    const { article, data_type, field_type, list, customHandler, customChecked } = props
    switch (field_type) {
        case "string":
        case "year":
        case "integer":
        case "float":
        case "email":
        case "password":
            return <ComponentInput article={article} field_type={field_type} customHandler={customHandler} />
        case "textarea":
            return <ComponentTextarea article={article} customHandler={customHandler} />
        case "list":
            return <ComponentSelect
                article={article}
                data_type={data_type}
                list={list ?? []}
                isMulti={data_type === "array" ?? false}
                isClearable
                customHandler={customHandler}
            />
        case "price":
            return <ComponentPrice article={article} data_type={data_type} customHandler={customHandler} />
        case "phone":
            return <ComponentPhone article={article} customHandler={customHandler} />
        case "date":
        case "time":
        case "datetime":
            return <ComponentDate article={article} field_type={field_type} customHandler={customHandler} />
        case "checkbox":
            return <ComponentCheckbox article={article} customChecked={customChecked} customHandler={customHandler} />
        default:
            return <ComponentInCreation type={field_type} />
    }
}

const UpdateFieldsModal: React.FC<ModuleListUpdateModalType> = ({ showModal, fields, selectedItems, hideModal }) => {
    const intl = useIntl()
    const { values, setFieldValue, handleSubmit } = useFormikContext<any>()
    const handleCloseModal = useCallback(() => {
        hideModal(false)
        setFieldValue("mode", "delete")
    }, [])
    return <Modal show={showModal} onHide={handleCloseModal} size="xl" onEntering={setModalIndex}>
        <Modal.Header closeButton>
            <Modal.Title>
                {intl.formatMessage({ id: "LIST.EDIT_MODAL_TITLE" })}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {fields ? <div className='table-responsive'>
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                    <thead>
                        <tr className='fw-bold text-muted'>
                            <th className='min-w-150px text-center'>{intl.formatMessage({ id: "LIST.EDIT_MODAL_PROPERTY_COLUMN" })}</th>
                            <th className='min-w-150px text-center'>{intl.formatMessage({ id: "LIST.EDIT_MODAL_COMMON_COLUMN" })}</th>
                            {selectedItems.map(item => <th key={item.id} className='min-w-150px text-center'>ID: <b>{item.id}</b></th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((field) => <tr key={field.article}>
                            <td className="fw-bold text-center fs-4">{field.title}</td>
                            <td>
                                <Field
                                    {...field}
                                    article={`additionals.${field.article}`}
                                    customHandler={field.field_type === "checkbox" ?
                                        () => {
                                            const currentValue = !(values.additionals?.[field.article])
                                            selectedItems.forEach((item: any, index: number) => {
                                                setFieldValue(`selectedItems[${index}].${field.article}`, currentValue)
                                            })
                                            return setFieldValue(`additionals.${field.article}`, currentValue)
                                        } :
                                        (value) => {
                                            const currentValue = value ?
                                                value.target ? value.target.value : Array.isArray(value) ?
                                                    value.map(option => option.value) : (value.value ?? value) : null
                                            selectedItems.forEach((item: any, index: number) => {
                                                setFieldValue(`selectedItems[${index}].${field.article}`, currentValue)
                                            })
                                            return setFieldValue(`additionals.${field.article}`, currentValue)
                                        }}

                                />
                            </td>
                            {selectedItems.map((item, index) => <td key={item.id}>  <Field {...field} article={`selectedItems[${index}].${field.article}`} /></td>)}
                        </tr>
                        )}
                    </tbody>
                </table>
                <div className="componentButton_container">
                    <ComponentButton
                        type="submit"
                        settings={{ title: intl.formatMessage({ id: "BUTTON.CANCEL" }), background: "light", icon: "" }}
                        customHandler={handleCloseModal}
                    />
                    <ComponentButton
                        type="submit"
                        settings={{ title: intl.formatMessage({ id: "BUTTON.SUBMIT" }), background: "dark", icon: "" }}
                        customHandler={() => {
                            hideModal(false)
                            handleSubmit()
                        }}
                    />
                </div>
            </div> : null}
        </Modal.Body>
    </Modal>
}

const Pagination: React.FC<ModuleListPaginationType> = ({ detail, filter: { page: filterPage, limit }, setFilter }) => {
    const intl = useIntl()
    const activePage = filterPage ?? 1
    const handlePageChange = (value: string | number) => {
        if (!detail) {
            return
        } else {
            if (typeof value === "number") {
                return setFilter((prev: any) => {
                    const filterValuesClone = { ...prev }
                    filterValuesClone.page = value
                    return filterValuesClone
                })
            } else {
                if (value === "Назад") {
                    return setFilter((prev: any) => {
                        if (activePage > 1) {
                            const filterValuesClone = { ...prev }
                            filterValuesClone.page = activePage - 1
                            return filterValuesClone
                        } else {
                            return prev
                        }
                    })
                } else if (value === "Вперёд") {
                    return setFilter((prev: any) => {
                        if (activePage < detail.pages_count) {
                            const filterValuesClone = { ...prev }
                            filterValuesClone.page = activePage + 1
                            return filterValuesClone
                        } else {
                            return prev
                        }
                    })
                }
            }
        }

    }

    const pagesFromDetailAsArray = useMemo(() => {
        const paginationArray: Array<number> = []
        if (detail?.pages_count) {
            for (let page = 1; page <= detail.pages_count; page++) {
                paginationArray.push(page)
            }
        }
        return paginationArray
    }, [detail])

    const paginationItems = useMemo(() => {
        const limit = 5
        if (activePage < limit) {
            return pagesFromDetailAsArray.slice(0, limit)
        } else if (activePage + limit > pagesFromDetailAsArray.length) {
            return pagesFromDetailAsArray.slice(pagesFromDetailAsArray.length - limit)
        } else {
            const indexOfActivePage = pagesFromDetailAsArray.indexOf(activePage)
            return pagesFromDetailAsArray.slice(indexOfActivePage - Math.floor(limit / 2), indexOfActivePage + Math.ceil(limit / 2))
        }
    }, [pagesFromDetailAsArray, activePage])

    const limitOptions = useMemo(() => [
        { label: "20", value: 20 },
        { label: "40", value: 40 },
        { label: "60", value: 60 },
        { label: "80", value: 80 },
        { label: "100", value: 100 },
        { label: "200", value: 200 }
    ], [])

    const currentLimitValue = useMemo(() => {
        return limitOptions.find(limitOption => limitOption.value === limit)
    }, [limit])

    const handleLimitChange = useCallback((value: { label: string, value: number }) => {
        const selectedLimit = value.value
        setFilter((prev: any) => {
            const filterValuesClone = { ...prev }
            filterValuesClone.limit = selectedLimit
            filterValuesClone.page = 1
            return filterValuesClone
        })
    }, [])

    if (!detail) {
        return null
    }

    return <div className='row'>
        <div className='col-sm-12 col-md-4 d-flex align-items-center justify-content-center justify-content-md-start'>
            <Select
                classNamePrefix="pagination_limit"
                options={limitOptions}
                value={currentLimitValue}
                /* @ts-ignore */
                onChange={handleLimitChange}
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                maxMenuHeight={150}
                menuPlacement="auto"
            />
        </div>
        <div className='col-sm-12 col-md-8 d-flex align-items-center justify-content-center justify-content-md-end'>
            <div id='kt_table_users_paginate'>
                <ul className='pagination'>
                    <li className={clsx('page-item', { previous: true })}>
                        <a
                            className={clsx('page-link', { 'page-text': true, 'me-5': true })}
                            onClick={() => handlePageChange("Назад")}
                            style={{ cursor: 'pointer', userSelect: "none" }}
                        >
                            {intl.formatMessage({ id: "BUTTON.PREVIOUS" })}
                        </a>
                    </li>
                    {paginationItems.map((page) => (
                        <li
                            key={page}
                            className={clsx('page-item', { active: page === activePage })}>
                            <a
                                className="page-link"
                                onClick={() => handlePageChange(page)}
                                style={{ cursor: 'pointer', userSelect: "none" }}
                            >
                                {page}
                            </a>
                        </li>
                    ))}
                    <li className={clsx('page-item', { next: true })}>
                        <a
                            className={clsx('page-link', { 'page-text': true })}
                            onClick={() => handlePageChange("Вперёд")}
                            style={{ cursor: 'pointer', userSelect: "none" }}
                        >
                            {intl.formatMessage({ id: "BUTTON.NEXT" })}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
}

const nonClickableCellsTypes = ["email", "phone", "buttons", "audio_player"]

const ListCell: React.FC<ModuleListCellType> = ({ article, type, row, page, filterable, setFilter }) => {
    const context = useSetupContext()
    const data = row[article]
    const navigate = useNavigate()

    const isDataAsHref = !(nonClickableCellsTypes.includes(type) || filterable) && page

    const handleCellClick = useCallback(() => {
        const navigateToInfoPage = row?.row_href_type === "info"
        return isDataAsHref ? navigate(`${page}/${navigateToInfoPage ? "info" : "update"}/${row.id}`) : null
    }, [isDataAsHref, page])
    const handleCellDataClick = useCallback((value: string | number | boolean) => {
        if (filterable) {
            return setFilter((prevFilter: any) => Object.assign({}, prevFilter, { [article]: value }))
        } else {
            return
        }
    }, [filterable])

    const resolvedData = () => {
        switch (type) {
            case "email":
                return <a href={`mailto:${data}`}>{data}</a>
            case "date":
                return <span
                    className={`moduleList_dateCell${data?.color ? ` bg-${data.color}` : ""}`}
                >{data ? moment(data?.value ?? data).format(getDateFormat(type, context, "string")) : null}</span>
            case "time":
                return <span
                    className={`moduleList_dateCell${data?.color ? ` bg-${data.color}` : ""}`}
                >{data ? moment(data?.value ?? data).format(getDateFormat(type, context, "string")) : null}</span>
            case "datetime":
                return <span
                    className={`moduleList_dateCell${data?.color ? ` bg-${data.color}` : ""}`}
                >{data ? moment(data?.value ?? data).format(getDateFormat(type, context, "string")) : null}</span>
            case "list":
                return Array.isArray(data) ? data.map((option, index, array) => {
                    const isLastElement = index === array.length - 1
                    return <span
                        key={option.value + index}
                        className={`moduleList_cellData${filterable ? " filterable" : ""}`}
                        onClick={() => handleCellDataClick(option.value)}>{`${option.title?.trim()}${isLastElement ? "" : ", "}`}</span>

                }) :
                    <span className={`moduleList_cellData${filterable ? " filterable" : ""}`} onClick={() => handleCellDataClick(data?.value)}>{data?.title}</span>
            case "buttons":
                return <ModuleListActionButtons data={data} />
            case "phone":
                return <span>{getMaskedString(data, type, context)}</span>
            case "price":
                return <span>{getMaskedString(data, type, context)}</span>
            case "image":
                const isImage = data?.includes("https")
                return <div className="moduleList_cellImageContainer">
                    {isImage ? <img className="moduleList_cellImage" src={data} alt={`${row.id}_${article}`} /> : null}
                </div>
            case "checkbox":
                const resolvedValue = data === true ? "Да" : "Нет"
                return <span>{resolvedValue}</span>
            case "audio_player": {
                return <ComponentAudio src={data} />
            }
            default:
                return <span className={`moduleList_cellData${filterable ? " filterable" : ""}`} onClick={() => handleCellDataClick(data)}>{checkDatesInString(data)}</span>
        }
    }
    return <td className={`moduleList_cell ${type} ${isDataAsHref ? " link" : ""}`} onClick={handleCellClick}>{resolvedData()}</td>
}


const ListRow: React.FC<ModuleListRowType> = ({ data, headers, page, filterKeys, isListEditable, setFilter }) => {

    const { values, setFieldValue } = useFormikContext<{ selectedItems: Array<any> }>()

    const { selectedItems } = values

    const indexOfId = selectedItems.findIndex(item => item.id === data.id)

    const isRowChecked = indexOfId !== -1

    const handleDeleteCheckboxClick = () => {
        const itemsToDeleteClone = [...selectedItems]
        if (indexOfId !== -1) {
            itemsToDeleteClone.splice(indexOfId, 1)
        } else {
            itemsToDeleteClone.push(data)
        }
        return setFieldValue("selectedItems", itemsToDeleteClone)
    }
    return <tr className={`moduleList_row ${isRowChecked ? " selected" : ""}`}>
        {
            isListEditable ? <td className="moduleList_cell deleteCheckbox">
                <ComponentCheckbox customChecked={isRowChecked} customHandler={handleDeleteCheckboxClick} />
            </td> : null
        }
        {headers.map(cell => <ListCell
            key={cell.article}
            article={cell.article}
            type={cell.type}
            row={data}
            page={page}
            filterable={filterKeys.includes(cell.article)}
            setFilter={setFilter}
        />
        )}
    </tr>
}


const HeaderCell: React.FC<ModuleListHeaderCellType> = ({ article, title, type, filter, setFilter }) => {

    const isSortableData = useMemo(() => {
        switch (type) {
            case "string":
            case "year":
            case "integer":
            case "float":
            case "email":
            case "date":
            case "time":
            case "datetime":
            case "phone":
            case "price":
            case "checkbox":
                return true
            default:
                return false
        }
    }, [type])

    const isDataSortedByCurrentArticle = isSortableData && filter.sort_by === article
    const isReverseSort = isDataSortedByCurrentArticle && filter.sort_order === "desc"
    const currentClassList = `moduleList_headerCell${type === "image" ? "" : " min-w-150px"}`
    const currentTitle = type === "image" ? "" : title

    const handleSort = () => setFilter((prev: any) => {
        const filterValuesClone = { ...prev }
        filterValuesClone.page = 1
        filterValuesClone.sort_by = article
        filterValuesClone.sort_order = prev.sort_by === article && prev.sort_order === "asc" ? "desc" : "asc"
        return filterValuesClone
    })

    return <th className={currentClassList}>
        <span>{currentTitle}</span>
        {isSortableData ? <button type="button"
            className={`moduleList_sortButton${isDataSortedByCurrentArticle ? " sorted" : ""}${isReverseSort ? " reverse" : ""}`}
            onClick={handleSort}
        ><KTSVG path='/media/crm/icons/sort.svg' /></button> : null}</th>
}

const ModuleList = React.memo<ModuleListType>((props) => {
    const intl = useIntl()
    const { settings, components, hook } = props
    const { headers, filters: initialFilters, is_csv, is_exel, is_edit = true, context: initialContext, linked_filter, link } = settings
    const haveButtons = Boolean(components?.buttons)
    const showCSVDownloader = Boolean(is_csv)
    const showExelDownloader = Boolean(is_exel)
    const isListEditable = is_edit
    const currentLink = typeof link === "string" ? link : link === false ? null : settings.object




    //блок фильтров
    const haveFilter = Boolean(components?.filters)
    const resolvedInitialFilterValues = Object.assign({}, { limit: 20, page: 1 }, initialFilters)
    const { filter, isInitials, setFilter, resetFilter } = useFilter(
        `${props.type}_${settings.object}`,
        resolvedInitialFilterValues,
        linked_filter,
        ["limit", "page", "sort_by", "sort_order"]
    )

    /*
    --- Сбрасывать пагинацию при изменении фильтрации
    */
    const previousFilter = usePrevious(filter)

    useEffect(() => {
        if (previousFilter) {
            const previousFilterClone = { ...previousFilter }
            const currentFilterClone = { ...filter }
            delete previousFilterClone["page"]
            delete currentFilterClone["page"]
            if (!isEqual(previousFilterClone, currentFilterClone)) {
                setFilter({ ...currentFilterClone, page: 1 })
            }
        }
    }, [filter])

    const context = Object.assign({}, { block: "list" }, initialContext ?? {})
    const resolvedFilter = { context, ...filter }
    const { isLoading: loading, isFetching, isRefetching, data: response, refetch } = useListData(settings.object, resolvedFilter)

    useSubscribeOnRefetch(refetch, linked_filter)

    useRefetchSubscribers(`${props.type}_${settings.object}`, isRefetching, Boolean(linked_filter))

    //проверка обновления при наличии хука 
    useUpdate([{ active: Boolean(hook), update: refetch }], hook, 1000)


    //блок поиска
    const haveSearch = Boolean(components.search)
    const { search, setSearch } = useSearch(`${props.type}_${settings.object}`)
    const isSetSearchData = haveSearch && search.length
    const {
        isLoading: searchLoading,
        isFetching: isSearchFetching,
        data: searchResponse,
        refetch: searchRefetch
    } = useSearchRequest({ object: settings.object, context: "list", value: search, enabled: haveSearch })


    //запрос полей под массовое редактирование
    const { isLoading: isGroupUpdateFieldsLoading, data: groupUpdateFields } = useRequest("admin", "group-update-fields", { scheme_name: settings.object }, is_edit)
    const [showUpdateFieldsModal, setShowUpdateFieldsModal] = useState(false)

    const { mutate: deleteItems, isSuccess: successDelete } = useMutate<{ id: Array<number> | number }>(settings.object, "remove")
    const { mutateAsync: updateItem, isSuccess: successUpdate } = useMutate<{ id: Array<number> | number }>(settings.object, "update")
    //преобразования
    const filterKeys = useMemo(() => {
        if (haveFilter) {
            return components.filters.map((filter: { settings: { recipient_property: string } }) => filter.settings.recipient_property)
        } else {
            return []
        }
    }, [])

    const resolvedHeaders = useMemo(() => Array.isArray(headers) ? isListEditable ?
        [...headers, { title: "", article: "buttons", type: "buttons" }] : headers : [], [headers, isListEditable])

    //подключение нужных данных
    const data = isSetSearchData ? searchResponse?.data : response?.data
    const detail = isSetSearchData ? searchResponse?.detail : response?.detail
    const isDataFetching = isSetSearchData ? isSearchFetching : isFetching
    const isEmptyData = isSetSearchData ? (!searchLoading && data?.length === 0) : (!loading && data?.length === 0)


    useEffect(() => {
        if (successDelete) {
            isSetSearchData ? searchRefetch() : refetch()
        }
    }, [successDelete])

    const handleDelete = (selectedItems: Array<any>) => {
        const selectedItemsIds = selectedItems.map(item => item.id)
        deleteItems({
            id: selectedItemsIds
        })
    }

    const handleUpdate = async (selectedItems: Array<any>, initialItems: Array<any>) => {
        const resolvedChangedItems = selectedItems.map(item => {
            const changedValues: any = {}
            const currentItemInitials = initialItems.find(initialItem => initialItem.id === item.id)
            for (let key in item) {
                if ((item[key] !== currentItemInitials[key]) || key === "id") {
                    changedValues[key] = item[key]
                }
            }
            return Object.keys(changedValues).length > 1 ? changedValues : null
        }).filter(item => item)

        await Promise.all(resolvedChangedItems.map(item => updateItem(item)))
        isSetSearchData ? searchRefetch() : refetch()
    }

    const isLoaded = useLoading(isDataFetching)
    const contextValue = useMemo(() => ({
        refresh: refetch
    }), [])


    const handleDownloadCSV = async (selectedColumns: Array<string>) => {
        const loadedCSV = await api(settings.object, "get", { context: { block: "csv" }, select: selectedColumns, ...filter })
        if (loadedCSV) {
            const link = document.createElement('a')
            //@ts-ignore
            link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(loadedCSV)}`
            const filename = `${settings.object} (${moment().format("DD.MM.YY")}).csv`
            link.setAttribute('download', `${filename}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } else {
            getErrorToast(intl.formatMessage({ id: "LIST.DOWNLOADER_FILE_ERROR" }))
        }
    }


    const handleDownloadExcel = async (selectedColumns: Array<string>) => {
        const loadedExcel = await fileApi(settings.object, "get", { context: { block: "exel" }, select: selectedColumns, ...filter })
        if (loadedExcel) {
            const link = document.createElement('a')
            //@ts-ignore
            link.href = URL.createObjectURL(new Blob([loadedExcel]))
            const filename = `${settings.object} (${moment().format("DD.MM.YY")}).xlsx`
            link.setAttribute('download', `${filename}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } else {
            getErrorToast(intl.formatMessage({ id: "LIST.DOWNLOADER_FILE_ERROR" }))
        }
    }

    return <ModuleContext.Provider value={contextValue}>
        {haveFilter ? <ComponentFilters
            type="string"
            data={components.filters}
            filterValues={filter}
            isInitials={isInitials}
            handleChange={setFilter}
            handleReset={resetFilter}
        /> : null}
        <div className="card moduleList">
            <div className="card-body py-3">
                {
                    haveSearch || haveButtons || showCSVDownloader || showExelDownloader ? <div className="moduleList_toolbar">
                        {haveSearch ? <ComponentSearch value={search} setValue={setSearch} /> : null}
                        {haveButtons ? components.buttons.map(button => <ComponentButton key={button.settings.title} className="dark-light" {...button} />) : null}
                        {showCSVDownloader ? <DownloaderModule
                            title={intl.formatMessage({ id: "LIST.CSV_BUTTON_TITLE" })}
                            handleDownload={handleDownloadCSV}
                            columns={headers}
                        /> : null}
                        {showExelDownloader ? <DownloaderModule
                            title={intl.formatMessage({ id: "LIST.EXCEL_BUTTON_TITLE" })}
                            handleDownload={handleDownloadExcel}
                            columns={headers}
                        /> : null}
                    </div> : null
                }
                <Formik enableReinitialize initialValues={{
                    selectedItems: [] as Array<any>,
                    data: data,
                    mode: "delete"
                }}
                    onSubmit={(values, { resetForm }) => {
                        values.mode === "edit" ? handleUpdate(values.selectedItems, values.data as Array<any>) : handleDelete(values.selectedItems)
                        resetForm()
                    }}
                >
                    {({ values, setFieldValue, handleSubmit }) => {
                        const { selectedItems } = values
                        const isMassCheckboxChecked = data?.every?.(item => selectedItems.find(selectedItem => item.id === selectedItem.id)) && Boolean(data.length)
                        const handleMassCheckboxClick = () => {
                            const currentItemsToCheck = !isMassCheckboxChecked && Array.isArray(data) ? data.map(item => item) : []
                            return setFieldValue("selectedItems", currentItemsToCheck)
                        }
                        return <FormikForm>
                            <div className={`table-responsive ${selectedItems.length ? " selectedItems" : ""}`}>
                                {selectedItems.length ? <div className="moduleList_selectedItemsContainer">
                                    <ComponentCheckbox
                                        customChecked={isMassCheckboxChecked}
                                        customHandler={handleMassCheckboxClick}
                                    />
                                    <span>{intl.formatMessage({ id: "LIST.SELECTED_ITEMS" })}<b>{selectedItems.length}</b></span>
                                    {
                                        groupUpdateFields ? <ComponentButton
                                            type="custom"
                                            settings={{
                                                title: intl.formatMessage({ id: "LIST.MASS_EDIT_BUTTON" }),
                                                background: "dark",
                                                icon: "edit"
                                            }}
                                            customHandler={() => {
                                                setShowUpdateFieldsModal(true)
                                                setFieldValue("mode", "edit")
                                            }}
                                            defaultLabel="icon"
                                        /> : null
                                    }
                                    <ComponentButton
                                        type="submit"
                                        settings={{
                                            title: intl.formatMessage({ id: "LIST.MASS_DELETE_BUTTON" }),
                                            background: "danger",
                                            icon: "trash",
                                            attention_modal: true
                                        }}
                                        customHandler={handleSubmit}
                                        defaultLabel="icon"
                                    />
                                </div> : null}
                                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                                    <thead>
                                        <tr className='fw-bold text-muted'>
                                            {
                                                isListEditable ? <th className="moduleList_headerCell deleteCheckbox">
                                                    <ComponentCheckbox
                                                        customChecked={isMassCheckboxChecked}
                                                        customHandler={handleMassCheckboxClick}
                                                        is_disabled={isEmptyData}
                                                    />

                                                </th> : null
                                            }
                                            {resolvedHeaders.map(column => <HeaderCell
                                                key={column.article}
                                                article={column.article}
                                                title={column.title}
                                                type={column.type}
                                                filter={filter}
                                                setFilter={setFilter}
                                            />)}

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!isLoaded ? <SkeletonRows headers={resolvedHeaders} previousRowsCount={data?.length} isListEditable={isListEditable} /> : null}
                                        {
                                            isLoaded && Array.isArray(data) ? data.map(item => {
                                                return <ListRow
                                                    /* в отчетных списках иногда отсутствую id. В качестве ключа - артикул первого же столбца */
                                                    key={item.id ?? item[resolvedHeaders[0].article]}
                                                    data={item}
                                                    headers={resolvedHeaders}
                                                    page={currentLink}
                                                    filterKeys={filterKeys}
                                                    isListEditable={isListEditable}
                                                    setFilter={setFilter}
                                                />
                                            })
                                                : null
                                        }

                                        {
                                            isLoaded && isEmptyData ? <tr>
                                                <td
                                                    className="moduleList_emptyTable"
                                                    colSpan={resolvedHeaders.length ? resolvedHeaders.length + 1 : 1}
                                                >{intl.formatMessage({ id: "LIST.EMPTY_ITEMS_LIST" })}</td>
                                            </tr> : null
                                        }

                                    </tbody>
                                </table>
                            </div>
                            <Pagination detail={detail} filter={filter} setFilter={setFilter} />
                            <UpdateFieldsModal
                                showModal={showUpdateFieldsModal}
                                hideModal={setShowUpdateFieldsModal}
                                fields={groupUpdateFields}
                                selectedItems={selectedItems}
                            />
                        </FormikForm>
                    }
                    }
                </Formik>
            </div>
        </div>
    </ModuleContext.Provider>
})

export default ModuleList