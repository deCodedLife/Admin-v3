import { Formik, Form as FormikForm } from "formik"
import moment from "moment"
import React, { useCallback, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import useItem from "../../../api/hooks/useItem"
import useMutate from "../../../api/hooks/useMutate"
import { TModuleFunnelColumn, TModuleFunnelItem, TModuleFunnel } from "./_types"
import ComponentButton from "../../components/ComponentButton"
import ComponentSelect from "../../components/ComponentSelect"
import * as Yup from 'yup';
import ComponentDashboard from "../../components/ComponentDashboard"
import { useLocation, useNavigate } from "react-router-dom"
import { useIntl } from "react-intl"
import ComponentFilters from "../../components/ComponentFilters"
import { useFilter } from "../helpers"
import SmoothSplashScreen from "../../helpers/SmoothSplashScreen"
import ComponentTooltip from "../../components/ComponentTooltip"
import setModalIndex from "../../helpers/setModalIndex"

const ModuleFunnelItem = React.memo<TModuleFunnelItem>(props => {

    const { id, title, description, tags, currentColumnId, handleOnDrag, handleClick } = props
    const intl = useIntl()
    const descriptionAsDate = moment(description).format("DD MMMM YY HH:mm")
    const navigate = useNavigate()
    const location = useLocation()
    const resolvedHref = `${location.pathname}/update/${id}`

    const handleTitleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        navigate(resolvedHref)
    }

    const haveTags = Array.isArray(tags) && tags.length
    return <div
        className="moduleFunnel_item"
        draggable
        onDrag={() => handleOnDrag(id, currentColumnId)}
    >
        <div className="moduleFunnel_itemMainProps">
            <ComponentTooltip title={title}>
                <a href={resolvedHref} onClick={handleTitleClick}>
                  <h4 className="moduleFunnel_itemTitle text-hover-primary">
                    {title}
                </h4>  
                </a>
                
            </ComponentTooltip>
            <div className='text-gray-400 fw-semibold fs-7'>{descriptionAsDate !== "Invalid date" ? descriptionAsDate : description}</div>
            {
                haveTags ? <div className="moduleFunnel_itemTags">
                    {tags.map(tag => <span key={tag.title} className={`badge badge-${tag.color}`}>{tag.title}</span>)}
                </div> : null
            }
        </div>
        <ComponentButton
            type="custom"
            settings={{ title: intl.formatMessage({ id: "BUTTON.EDIT" }), icon: "gear", background: "light" }}
            customHandler={() => handleClick(id, currentColumnId)}
            defaultLabel="icon" />
    </div>
})

const ModuleFunnelColumn: React.FC<TModuleFunnelColumn> = props => {

    const { id, title, items, color, isItemsFetching, handleOnDrag, handleOnDrop, handleClick } = props
    const count = items.length

    return <div className="moduleFunnel_column"
        onDragOver={event => event.preventDefault()}
        onDrop={(event) => {
            handleOnDrop(id)
            event.currentTarget.classList.remove("dragEnter")
        }}
        onDragEnter={(event) => {
            event.currentTarget.classList.add("dragEnter")
        }}
        onDragLeave={(event) => {
            const relatedTarget = event.relatedTarget

            if (relatedTarget instanceof Element && relatedTarget.closest(".moduleFunnel_column") !== event.currentTarget) {
                event.currentTarget.classList.remove("dragEnter")
            }
        }}
    >
        <div className="card">
            <div className='card-body p-0'>
                <div className={`moduleFunnel_columnReport bg-${color}`}>
                    <div className="moduleFunnel_columnReportContent">
                        <h3 className="moduleFunnel_columnReportTitle">{title}</h3>
                        <span className="moduleFunnel_columnReportCounter">{count}</span>
                    </div>
                </div>
                <div className={`moduleFunnel_columnList${isItemsFetching ? " overflow-hidden" : ""}`}>
                    <SmoothSplashScreen active={isItemsFetching} />
                    {items.map(item => <ModuleFunnelItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        tags={item.tags}
                        currentColumnId={id}
                        handleOnDrag={handleOnDrag}
                        handleClick={handleClick}
                    />)}
                </div>
            </div>
        </div>
    </div>
}

const ModuleFunnel: React.FC<TModuleFunnel> = props => {
    const intl = useIntl()
    const { components, settings } = props
    const { object, filter: columnsObject, property } = settings
    const haveButtons = Boolean(components?.buttons)
    const haveFilter = Boolean(components?.filters)
    const { data: columns } = useItem(columnsObject, { context: { block: "funnel" } })
    const { filter, isInitials, setFilter, resetFilter } = useFilter(`${props.type}_${settings.object}`, { context: { block: "funnel" }, limit: 2000 })
    const { data: rows, refetch: updateItems, isFetching: isItemsFetching } = useItem(object, filter)
    const [draggableItem, setDraggableItem] = useState<{ id: number, currentColumnId: number } | null>(null)
    const [selectedItem, setSelectedItem] = useState<{ id: number, currentColumnId: number } | null>(null)
    const { mutate, isSuccess } = useMutate(object, "update")

    useEffect(() => {
        if (isSuccess) {
            updateItems()
        }
    }, [isSuccess])
    const getCurrentColumnItems = (id: number) => {
        return Array.isArray(rows) ? rows.filter(item => item[property]?.value === id) : []
    }
    const handleOnDrap = useCallback((id: number, currentColumnId: number) => setDraggableItem(prev => prev?.id === id ? prev : { id, currentColumnId }), [])
    const handleOnDrop = (columnId: number) => {
        if (columnId === draggableItem?.currentColumnId) {
            return
        } else {
            mutate({
                id: draggableItem?.id,
                [property]: columnId
            })
        }
        setDraggableItem(null)
    }

    const handleClick = useCallback((id: number, currentColumnId: number) => setSelectedItem({ id, currentColumnId }), [])
    const handleSubmit = (values: { id: number | undefined, column_id: number | undefined }) => {
        if (values.column_id === selectedItem?.currentColumnId) {
            return
        } else {
            mutate({
                id: values.id,
                [property]: values.column_id
            })
        }
    }

    return <>
        <ComponentDashboard>
            {haveButtons ? components.buttons.map(button => <ComponentButton key={button.settings.title} {...button} />) : null}
            {haveFilter ? <ComponentFilters
                type="dropdown"
                data={components.filters}
                filterValues={filter}
                isInitials={isInitials}
                handleChange={setFilter}
                handleReset={resetFilter}
            /> : null}
        </ComponentDashboard>
        <div className="moduleFunnel">
            {columns?.map(column => <ModuleFunnelColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color?.value ?? "primary"}
                items={getCurrentColumnItems(column.id)}
                isItemsFetching={isItemsFetching}
                handleOnDrag={handleOnDrap}
                handleOnDrop={handleOnDrop}
                handleClick={handleClick}
            />)}
            <Modal
                size="lg"
                show={Boolean(selectedItem)}
                onHide={() => setSelectedItem(null)}
                onEntering={setModalIndex}
            >
                <Modal.Header>
                    <Modal.Title>
                        {intl.formatMessage({ id: "MODAL.EDIT_TITLE" })}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{ id: selectedItem?.id, column_id: selectedItem?.currentColumnId }}
                        validationSchema={Yup.object().shape({
                            column_id: Yup.number().required().typeError(" ")
                        })}
                        onSubmit={val => {
                            handleSubmit(val)
                            setSelectedItem(null)
                        }} >
                        {({ handleSubmit }) =>
                            <FormikForm>
                                <div className="moduleFunnel_modalField">
                                    <ComponentSelect
                                        article="column_id"
                                        data_type="integer"
                                        placeholder={intl.formatMessage({ id: "FUNNEL.SELECT_PLACEHOLDER" })}
                                        list={Array.isArray(columns) ? columns.map(column => ({ title: column.title, value: column.id })) : []}
                                        isClearable
                                    />
                                </div>
                                <div className="componentButton_container">
                                    <ComponentButton
                                        type="custom"
                                        settings={{ title: intl.formatMessage({ id: "BUTTON.CANCEL" }), icon: "", background: "light" }}
                                        customHandler={() => setSelectedItem(null)}
                                    />
                                    <ComponentButton
                                        type="submit"
                                        settings={{ title: intl.formatMessage({ id: "BUTTON.SUBMIT" }), icon: "", background: "dark" }}
                                        customHandler={handleSubmit}
                                    />
                                </div>
                            </FormikForm>
                        }
                    </Formik>
                </Modal.Body>

            </Modal>
        </div>
    </>
}

export default ModuleFunnel