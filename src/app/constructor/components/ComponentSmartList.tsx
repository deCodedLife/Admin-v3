import React from "react"
import ComponentButton from "./ComponentButton"
import { useField, useFormikContext } from "formik"
import { Component } from "../modules/ModuleForm/ModuleForm"
import { Col, Form } from "react-bootstrap"
import { KTSVG } from "../../../_metronic/helpers"
import { ComponentSmartListPropertiesRowType, ComponentSmartListPropertyType, ComponentSmartListType } from "../../types/components"
import { useIntl } from "react-intl"
import ComponentTooltip from "./ComponentTooltip"

const ComponentSmartListProperty: React.FC<ComponentSmartListPropertyType> = (props) => {
    const { title, is_required, size } = props
    const resolvedSize = size ? size * 3 : 3
    return <Form.Group className="componentSmartList_property" as={Col} md={resolvedSize}>
        {
            title ? <Form.Group as={Col} md={12}>
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
}

const ComponentSmartListPropertiesRow: React.FC<ComponentSmartListPropertiesRowType> = ({ parentArticle, properties, hook, handleDeleteRow }) => {
    return <div className="componentSmartList_propertiesRow">
        <button type="button" className="componentSmartList_propertiesRowButton" onClick={handleDeleteRow}>
            <KTSVG path="/media/crm/icons/close.svg" />
        </button>
        {properties.map(field => <ComponentSmartListProperty key={field.article} {...field} article={`${parentArticle}.${field.article}`} hook={hook} />)}
    </div>
}

const ComponentSmartList: React.FC<ComponentSmartListType> = ({ article, properties, hook }) => {
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
                properties={properties}
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