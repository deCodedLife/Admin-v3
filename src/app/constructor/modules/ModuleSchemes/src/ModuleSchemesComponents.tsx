import React from "react"
import { Col, Form } from "react-bootstrap"
import ComponentTooltip from "../../../components/ComponentTooltip"
import {
    TModuleSchemesButtonsContainer,
    TModuleSchemesField,
    TModuleSchemesFieldsRow,
    TModuleSchemesFieldsSection
} from "../_types";

export const ModuleSchemesFieldsSection: React.FC<TModuleSchemesFieldsSection> = ({ title, className = "", children }) => {
    return <div className={`moduleSchemes_fieldsSection ${className}`}>
        {title ? <h3 className="moduleSchemes_fieldsSectionTitle">{title}</h3> : null}
        {children}
    </div>
}

export const ModuleSchemesFieldsRow: React.FC<TModuleSchemesFieldsRow> = ({ children }) => {
    return <div className="moduleSchemes_fieldsRow">
        {children}
    </div>
}

export const ModuleSchemesField: React.FC<TModuleSchemesField> = ({ size, title, children, required = false }) => {
    return <Form.Group className="moduleSchemes_field" as={Col} md={size}>
        <ComponentTooltip title={title}>
            <label className={`moduleSchemes_field_label${required ? " required" : ""}`}>{title}</label>
        </ComponentTooltip>
        {children}
    </Form.Group>
}

export const ModuleSchemesButtonsContainer: React.FC<TModuleSchemesButtonsContainer> = ({ children }) => {
    return <div className="moduleSchemes_buttonsContainer">
        {children}
    </div>
}



