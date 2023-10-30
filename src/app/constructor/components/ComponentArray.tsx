import { Form as FormikForm, Formik, useField, useFormikContext } from "formik"
import React, { useState } from "react"
import { Col, Form, Modal } from "react-bootstrap"
import { ComponentArrayFieldType, ComponentArrayType } from "../../types/components"
import ComponentButton from "./ComponentButton"
import ComponentInput from "./ComponentInput"
import ComponentSelect from "./ComponentSelect"
import ComponentObject from "./ComponentObject"
import { useIntl } from "react-intl"
import setModalIndex from "../helpers/setModalIndex"

const Field: React.FC<{ field: ComponentArrayFieldType }> = ({ field }) => {
    const { values, setFieldValue } = useFormikContext<any>()
    const handleOnResetChange = field.resetOnChange ? (value: { title: string, value: any } | null) => {
        for (let key in values) {
            if (key !== field.article) {
                setFieldValue(key, undefined)
            }
        }
        setFieldValue(field.article, value?.value ?? value)
    } : undefined

    switch (field.type) {
        case "select":
            return <ComponentSelect
                article={field.article}
                data_type="string"
                list={field.list ?? []}
                isDisabled={!field.list?.length}
                isMulti={field.isMulti}
                customHandler={handleOnResetChange}
            />
        case "array":
            return <ComponentArray article={field.article} data_type="string" />
        case "object":
            return <ComponentObject article={field.article} />
        default:
            return <ComponentInput article={field.article} field_type="string" />
    }
}

const ComponentArrayFormField: React.FC<{ field: ComponentArrayFieldType, values: any, size?: number }> = ({ field, values }) => {
    const dependency = field.dependency
    const dependencyReconciliation = dependency ? Array.isArray(dependency.value) ?
        dependency.value.includes(values[dependency.article]) :
        values[dependency.article] === dependency.value : true
    if (dependencyReconciliation) {
        return <Form.Group className="componentArray_form_field" as={Col} md={field.size ?? 12}>
            <label className="componentArray_form_label">
                {field.title}
            </label>
            <Field field={field} />
        </Form.Group>
    }
    else {
        return null
    }
}

const ComponentArrayItem: React.FC<
    {
        label?: string,
        value: any,
        isObject: boolean,
        draggable?: boolean,
        handleClick: (value: any) => void,
        handleOnDrag: (value: any) => void,
        handleOnDrop: (value: any) => void,
    }
> = ({ label, value, isObject, draggable, handleClick, handleOnDrag, handleOnDrop }) => {
    const labelSteps = label?.split(".") ?? []
    const valueView = isObject ? labelSteps.length ? labelSteps.reduce((acc, step) => acc?.[step], value) ?? "-" : "-" : value
    return <div
        className="componentArray_item"
        draggable={draggable}
        onClick={() => handleClick(isObject ? value : { value })}
        onDrag={() => handleOnDrag(isObject ? value : { value })}
        onDrop={() => handleOnDrop(isObject ? value : { value })}
        onDragOver={event => event.preventDefault()}
    >
        {valueView}
    </div>
}

const ComponentArray: React.FC<ComponentArrayType> = ({ label, article, data_type, fields, customHandler, draggable }) => {
    const intl = useIntl()
    const [field] = useField(article)
    const { setFieldValue } = useFormikContext<any>()
    const isObject = data_type === "object" && Array.isArray(fields)
    const [showFormModal, setShowFormModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [draggableItem, setDraggableItem] = useState<any>(null)

    const handleOnDrag = (value: any) => {
        if (isObject) {
            setDraggableItem(value)
        } else {
            setDraggableItem((prev: any) => value.value !== prev?.value ? value : prev)
        }

    }
    const handleOnDrop = (value: any) => {
        const isDropOnSelf = isObject ? draggableItem === value : draggableItem.value === value.value
        if (!draggableItem || isDropOnSelf) {
            return
        } else {
            const currentFieldValue = Array.isArray(field.value) ? [...field.value] : []
            const draggableItemIndex = currentFieldValue.findIndex(item => item === (isObject ? draggableItem : draggableItem.value))
            const dropableItemIndex = currentFieldValue.findIndex(item => item === (isObject ? value : value.value))
            currentFieldValue.splice(draggableItemIndex, 1, isObject ? value : value.value)
            currentFieldValue.splice(dropableItemIndex, 1, isObject ? draggableItem : draggableItem.value)
            setFieldValue(article, currentFieldValue)
            setDraggableItem(null)
        }

    }
    const handleClose = () => {
        setSelectedItem(null)
        setShowFormModal(false)
    }

    const handleSubmit = (values: any, { resetForm }: { resetForm: () => void }) => {
        const currentFieldValue = Array.isArray(field.value) ? [...field.value] : []
        if (selectedItem) {
            const selectedItemIndex = currentFieldValue.indexOf(isObject ? selectedItem : selectedItem.value)
            currentFieldValue.splice(selectedItemIndex, 1, isObject ? values : values.value)
        } else {
            currentFieldValue.push(isObject ? values : values.value)
        }
        customHandler ? customHandler(currentFieldValue) : setFieldValue(article, currentFieldValue)
        resetForm()
        return handleClose()
    }



    const handleDelete = () => {
        const currentFieldValue = Array.isArray(field.value) ? [...field.value] : []
        const selectedItemIndex = currentFieldValue.indexOf(isObject ? selectedItem : selectedItem.value)
        currentFieldValue.splice(selectedItemIndex, 1)
        setFieldValue(article, currentFieldValue)
        return handleClose()
    }
    const handleItemClick = (value: any) => {
        setSelectedItem(value)
        setShowFormModal(true)
    }

    const defaultField = {
        title: intl.formatMessage({ id: "ARRAY.DEFAULT_VALUE_LABEL" }),
        article: "value",
        type: "input",
    }

    return <div className="componentArray">
        {field.value?.map((value: any) => <ComponentArrayItem
            label={label}
            value={value}
            isObject={isObject}
            draggable={draggable}
            handleClick={handleItemClick}
            handleOnDrag={handleOnDrag}
            handleOnDrop={handleOnDrop} />)}
        <ComponentButton type="custom" className="componentArray_button" settings={{ title: "+", icon: "", background: "dark" }} customHandler={() => setShowFormModal(true)} />
        <Modal
            size="lg"
            show={showFormModal}
            onHide={handleClose}
            centered
            onEntering={setModalIndex}
        >
            <Modal.Header>
                <Modal.Title>
                    {intl.formatMessage({ id: "MODAL.APPEND_TITLE" })}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik initialValues={selectedItem ?? {}} onSubmit={handleSubmit} >
                    {({ handleSubmit, values }) => <FormikForm className="componentArray_form">
                        {isObject ? fields.map(field => <ComponentArrayFormField key={field.article} field={field} values={values} />) : <ComponentArrayFormField field={defaultField} values={values} />}
                        <div className="componentArray_formButtons">
                            <ComponentButton
                                type="submit"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.APPEND" }), background: "dark", icon: "" }}
                                customHandler={handleSubmit}
                            />
                            {selectedItem ? <ComponentButton
                                type="custom"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.DELETE" }), background: "danger", icon: "" }}
                                customHandler={handleDelete} /> : null}
                        </div>
                    </FormikForm>
                    }
                </Formik>
            </Modal.Body>

        </Modal>
    </div>
}

export default ComponentArray