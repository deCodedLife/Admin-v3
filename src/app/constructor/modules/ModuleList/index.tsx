import { Formik, Form as FormikForm, useFormikContext } from "formik"
import moment from "moment"
import React, { useEffect, useMemo, useState } from "react"
import { Modal } from "react-bootstrap"
import useListData from "../../../api/hooks/useListData"
import useMutate from "../../../api/hooks/useMutate"
import useRequest from "../../../api/hooks/useRequest"
import useSearchRequest from "../../../api/hooks/useSearchRequest"
import ComponentButton from "../../components/ComponentButton"
import ComponentCheckbox from "../../components/ComponentCheckbox"
import ComponentFilters from "../../components/ComponentFilters"
import ComponentSearch from "../../components/ComponentSearch"
import { useFilter, useSearch } from "../helpers"
import { KTSVG } from "../../../../_metronic/helpers"
import { useIntl } from "react-intl"
import api, { fileApi } from "../../../api"
import SkeletonRows from "./src/SkeletonRows"
import useLoading from "../../components/helpers/hooks/useLoading"
import { getErrorToast } from "../../helpers/toasts"
import { ModuleContext } from "../helpers/useModuleContent"
import useUpdate from "../../../api/hooks/useUpdate"
import setModalIndex from "../../helpers/setModalIndex"
import usePrevious from "../../helpers/usePrevious"
import { isEqual } from "lodash"
import { useRefetchSubscribers, useSubscribeOnRefetch } from "../helpers/PageContext"
import useInfiniteListData from "../../../api/hooks/useInfiniteListData"
import ComponentModal from "../../components/ComponentModal"
import { TComponentButton } from "../../components/ComponentButton/_types"
import { TModuleList, TModuleListDownloader, TModuleListHeaderCell, TModuleListRow } from "./_types";
import { Pagination } from "./src/Pagination"
import { InfiniteScroll } from "./src/InfiniteScroll"
import { ListCell } from "./src/ListCell"
import { UpdateFieldsModal } from "./src/UpdateFieldsModal"

export const getButtonKey = (button: TComponentButton) => `${button.type}-${button.settings.title}-${button.settings.icon}`

const DownloaderModule: React.FC<TModuleListDownloader> = ({ title, handleDownload, columns }) => {
    const intl = useIntl()
    const [showModal, setShowModal] = useState(false)
    const handleSubmit = async (selectedColumns: Array<string>) => {
        await handleDownload(selectedColumns)
        setShowModal(false)
    }
    const initialSelectedColumns = useMemo(() => {
        return columns.map(column => column.article)
    }, [columns])

    return <div>
        <ComponentButton
            className="moduleList_downloaderModuleButton"
            type="custom"
            settings={{ title, icon: "download", background: "light" }}
            customHandler={() => setShowModal(true)}
        />
        <Modal show={showModal} onHide={() => setShowModal(false)} onEntering={setModalIndex}>
            <Formik initialValues={{
                select: initialSelectedColumns
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


const ListRow: React.FC<TModuleListRow> = props => {
    const { data, headers, page, filterKeys, isListEditable, setFilter, setIndividualPage } = props
    const { values, setFieldValue } = useFormikContext<{ selectedItems: Array<any> }>()

    const { selectedItems } = values

    /*
    --- Для строк без id отключаем чекбокс выбора строки
    */
    const isCheckboxEnabled = Boolean(data.id)

    const indexOfRow = isCheckboxEnabled ? selectedItems.findIndex(selectedItem => selectedItem.id === data.id) : -1

    const isRowChecked = indexOfRow !== -1


    const handleDeleteCheckboxClick = () => {
        if (!isCheckboxEnabled) {
            return
        }

        const itemsToDeleteClone = [...selectedItems]
        if (isRowChecked) {
            itemsToDeleteClone.splice(indexOfRow, 1)
        } else {
            itemsToDeleteClone.push(data)
        }
        return setFieldValue("selectedItems", itemsToDeleteClone)
    }

    return <tr className={`moduleList_row ${isRowChecked ? " selected" : ""}`}>
        {
            isListEditable ? <td className="moduleList_cell deleteCheckbox">
                <ComponentCheckbox customChecked={isRowChecked} customHandler={handleDeleteCheckboxClick} is_disabled={!isCheckboxEnabled} />
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
            setIndividualPage={setIndividualPage}
            suffix={cell.suffix}
        />
        )}
    </tr>
}


const HeaderCell: React.FC<TModuleListHeaderCell> = props => {
    const { article, title, type, filter, setFilter, isListEditable } = props
    const isSortableData = useMemo(() => {
        if (!isListEditable) {
            return false
        } else {
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
        }
    }, [type, isListEditable])

    const isDataSortedByCurrentArticle = isSortableData && filter.sort_by === article
    const isReverseSort = isDataSortedByCurrentArticle && filter.sort_order === "desc"
    const currentClassList = `moduleList_headerCell ${type}`
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

const ModuleList = React.memo<TModuleList>((props) => {
    const intl = useIntl()
    const { settings, components, hook } = props
    const { headers, filters: initialFilters, is_csv, is_exel, is_edit = true, context: initialContext, linked_filter, link, is_infinite } = settings
    const haveButtons = Boolean(components?.buttons)
    const showCSVDownloader = Boolean(is_csv)
    const showExelDownloader = Boolean(is_exel)
    const isListEditable = is_edit
    const currentLink = typeof link === "string" ? link : link === false ? null : settings.object
    const withInfiniteScroll = is_infinite




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
    const { data: response, isLoading: loading, isFetching, isRefetching, refetch } = useListData(settings.object, resolvedFilter, !withInfiniteScroll)
    const {
        data: infiniteResponse,
        isLoading: isInifiniteDataLoading,
        isFetching: isInfiniteDataFetching,
        hasNextPage,
        fetchNextPage,
        refetch: infiniteRefetch
    } = useInfiniteListData(settings.object, resolvedFilter, withInfiniteScroll)

    useSubscribeOnRefetch(refetch, linked_filter)

    useRefetchSubscribers(`${props.type}_${settings.object}`, isRefetching, Boolean(linked_filter))

    //проверка обновления при наличии хука 
    useUpdate([{ active: Boolean(hook), update: refetch }], hook, 1000)


    //блок поиска
    const haveSearch = Boolean(components.search)
    const { search, setSearch } = useSearch(`${props.type}_${settings.object}`)
    const isSetSearchData = haveSearch && Boolean(search.length)
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
    const data = isSetSearchData ? searchResponse?.data :
        withInfiniteScroll ? infiniteResponse?.pages.reduce<Array<{ [key: string]: any }>>((acc, currentValue) => acc.concat(currentValue.data), []) : response?.data
    const detail = isSetSearchData ? searchResponse?.detail :
        withInfiniteScroll ? infiniteResponse?.pages[0]?.detail : response?.detail
    const isDataFetching = isSetSearchData ? isSearchFetching : withInfiniteScroll ? false : isFetching
    const isEmptyData = isSetSearchData ? (!searchLoading && data?.length === 0) :
        withInfiniteScroll ? (!isInifiniteDataLoading && data?.length === 0) : (!loading && data?.length === 0)

    const dataWithIds = useMemo(() => {
        if (Array.isArray(data)) {
            return data.filter(item => item.id)
        } else {
            return []
        }
    }, [data])

    useEffect(() => {
        if (successDelete) {
            isSetSearchData ? searchRefetch() : withInfiniteScroll ? infiniteRefetch() : refetch()
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
        refresh: isSetSearchData ? searchRefetch : withInfiniteScroll ? infiniteRefetch : refetch
    }), [isSetSearchData])


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


    //модальное окно отрытия отдельной от всей строки ссылки
    const [individualPage, setIndividualPage] = useState<string | null>(null)
    const isModuleHaveIndividualModal = resolvedHeaders.some(header => header.type === "link_list")

    return <ModuleContext.Provider value={contextValue}>
        {isModuleHaveIndividualModal ? <ComponentModal show={Boolean(individualPage)} page={individualPage} setShow={() => setIndividualPage(null)} /> : null}
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
                        const isMassCheckboxChecked = Boolean(dataWithIds.length) && dataWithIds.every(item => selectedItems.find(selectedItem => item.id === selectedItem.id))
                        const handleMassCheckboxClick = () => {

                            if (!dataWithIds.length) {
                                return
                            }

                            const currentItemsToCheck = isMassCheckboxChecked ? [] : dataWithIds
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
                                                        is_disabled={isEmptyData || !dataWithIds.length}
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
                                                isListEditable={isListEditable}
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
                                                    setIndividualPage={setIndividualPage}
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
                            {
                                isSetSearchData ? null :
                                    withInfiniteScroll ? <InfiniteScroll
                                        fetch={fetchNextPage}
                                        currentRowsCount={data?.length}
                                        rowsCount={detail?.rows_count}
                                        hasNextPage={hasNextPage}
                                        isFetching={isInfiniteDataFetching}
                                    /> :
                                        <Pagination detail={detail} filter={filter} setFilter={setFilter} />
                            }

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