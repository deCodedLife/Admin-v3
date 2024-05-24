import { useIntl } from "react-intl"
import { TModuleListPagination } from "../_types"
import { useMemo, useCallback } from "react"
import Select from "react-select"
import clsx from "clsx"

export const Pagination: React.FC<TModuleListPagination> = props => {
    const { detail, filter: { page: filterPage, limit }, setFilter } = props
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
  
    return <div className="pagination_container">
        <div className="pagination_limitContainer">
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
        <div className="pagination_details">
            {`Записи с ${limit * (activePage - 1) + 1} по ${limit * activePage > detail.rows_count ? detail.rows_count : limit * activePage}${detail.rows_count ? ` из ${detail.rows_count}` : "" }`}
        </div>
        <div className="pagination_pages">
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