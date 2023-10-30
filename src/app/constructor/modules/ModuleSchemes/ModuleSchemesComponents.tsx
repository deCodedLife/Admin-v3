import React from "react"
import { Col, Form } from "react-bootstrap"
import ComponentTooltip from "../../components/ComponentTooltip"

export const ModuleSchemesFieldsSection: React.FC<
    { title?: string, className?: string, children: Array<React.ReactChild | null> | React.ReactChild | null }
> = ({ title, className = "", children }) => {
    return <div className={`moduleSchemes_fieldsSection ${className}`}>
        {title ? <h3 className="moduleSchemes_fieldsSectionTitle">{title}</h3> : null}
        {children}
    </div>
}

export const ModuleSchemesFieldsRow: React.FC<{ children: Array<React.ReactChild | null> | React.ReactChild | null }> = ({ children }) => {
    return <div className="moduleSchemes_fieldsRow">
        {children}
    </div>
}

export const ModuleSchemesField: React.FC<{ title: string, size: number, children: React.ReactChild, required?: boolean }> = ({ size, title, children, required = false }) => {
    return <Form.Group className="moduleSchemes_field" as={Col} md={size}>
        <ComponentTooltip title={title}>
            <label className={`moduleSchemes_field_label${required ? " required" : ""}`}>{title}</label>
        </ComponentTooltip>
        {children}
    </Form.Group>
}

export const ModuleSchemesButtonsContainer: React.FC<{ children: Array<React.ReactChild | null> | React.ReactChild | null }> = ({ children }) => {
    return <div className="moduleSchemes_buttonsContainer">
        {children}
    </div>
}



