import React from "react"
import ComponentButton from "../ComponentButton"
import { useField, useFormikContext } from "formik"
import { Component } from "../../modules/ModuleForm"
import { Col, Form } from "react-bootstrap"
import { KTSVG } from "../../../../_metronic/helpers"
import { useIntl } from "react-intl"
import ComponentTooltip from "../ComponentTooltip"
import { TComponentSmartList, TComponentSmartListPropertiesRow, TComponentSmartListProperty } from "./_types"

const ComponentSmartListProperty = React.memo<TComponentSmartListProperty>(props => {
    const { title, is_required, size, is_headers_shown, index } = props
    const showTitle = title && (is_headers_shown ? true : index === 0 ? true : false)
    const resolvedSize = size ? size * 3 : 3
    return <Form.Group className="componentSmartList_property" as={Col} md={resolvedSize}>
        {
            showTitle ? <Form.Group as={Col} md={12}>
                <ComponentTooltip title={title}>
                    <label className={`componentSmartList_propertyLabel${is_required ? " required" : ""}`}>
                        {title}
                    </label>
                </ComponentTooltip>
            </Form.Group> : null
        }
        <Form.Group as={Col} md={12}>
            <Component {...props} />
        </Form.Group>
    </Form.Group>
})

const ComponentSmartListPropertiesRow: React.FC<TComponentSmartListPropertiesRow> = props => {
    const { parentArticle, properties, is_headers_shown, parentIndex, hook, handleDeleteRow } = props
    return <div className="componentSmartList_propertiesRow">
        <button type="button" className="componentSmartList_propertiesRowButton" onClick={handleDeleteRow}>
            <KTSVG path="/media/crm/icons/close.svg" />
        </button>
        {properties.map(field => <ComponentSmartListProperty
            key={field.article}
            index={parentIndex}
            {...field}
            article={`${parentArticle}.${field.article}`}
            hook={hook}
            is_headers_shown={is_headers_shown}
        />)}
    </div>
}

const ComponentSmartList: React.FC<TComponentSmartList> = props => {
    const { article, properties, hook, is_headers_shown } = props
    const intl = useIntl()
    const [field] = useField(article)
    const { value } = field
    const { setFieldValue } = useFormikContext<any>()
    
    const handleAppendRow = () => {
        const valuesClone = Array.isArray(value) ? [...value] : []
        const newPropertyObject: any = {}
        properties.forEach(property => newPropertyObject[property.article] = undefined)
        valuesClone.push(newPropertyObject)
        setFieldValue(article, valuesClone)
    }
    const handleDeleteRow = (index: number) => {
        const valuesClone = Array.isArray(value) ? [...value] : []
        valuesClone.splice(index, 1)
        setFieldValue(article, valuesClone)
    }

    return <div className="componentSmartList">
        <div className="componentSmartList_propertiesContainer">
            {value?.map?.((value: any, index: number) => {
                return <ComponentSmartListPropertiesRow
                    key={`${article}[${index}]`}
                    parentArticle={`${article}[${index}]`}
                    parentIndex={index}
                    properties={properties}
                    is_headers_shown={is_headers_shown}
                    hook={hook}
                    handleDeleteRow={() => handleDeleteRow(index)}
                />
            })}
        </div>
        <ComponentButton
            className="componentSmartList_addButton"
            type="custom"
            settings={{ title: intl.formatMessage({ id: "BUTTON.APPEND" }), icon: "", background: "dark" }}
            customHandler={handleAppendRow}
        />
    </div>
}
export default ComponentSmartList