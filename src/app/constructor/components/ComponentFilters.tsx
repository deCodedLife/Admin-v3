import clsx from "clsx"
import { Form as FormikForm, Formik } from "formik"
import React, { useMemo } from "react"
import { Col, Dropdown, Form } from "react-bootstrap"
import { KTSVG } from "../../../_metronic/helpers"
import { useLayout } from "../../../_metronic/layout/core"
import { ComponentFiltersType, ComponentFilterType } from "../../types/components"
import ComponentButton from "./ComponentButton"
import ComponentDate from "./ComponentDate"
import ComponentInCreation from "./ComponentInCreation"
import ComponentSelect from "./ComponentSelect"
import ComponentPrice from "./ComponentPrice"
import ComponentInput from "./ComponentInput"
import { useIntl } from "react-intl"
import ComponentCheckbox from "./ComponentCheckbox"

const ComponentFilter: React.FC<ComponentFilterType & { className?: string }> = (props) => {
    const { type, settings, placeholder, title, className = "" } = props
    switch (type) {
        case "date":
            return <ComponentDate
                className={className}
                article={settings.recipient_property}
                field_type={type}
                placeholder={placeholder}
                onBlurSubmit
                custom_format
            />
        case "list":
            return <ComponentSelect
                article={settings.recipient_property}
                data_type="string"
                placeholder={placeholder}
                list={settings.list ?? []}
                isMulti={Boolean(settings.is_multi)}
                prefix={className}
                isClearable={(settings.is_clearable === false) ? settings.is_clearable : true}
                search={settings.is_search ? settings.donor_object : undefined}
                object={settings.donor_object}
                select={settings.donor_property_title}
                onChangeSubmit />
        case "integer":
            return <ComponentInput className={className} article={settings.recipient_property} field_type="integer" placeholder={placeholder} onBlurSubmit />
        case "price":
            return <ComponentPrice className={className} article={settings.recipient_property} data_type="integer" placeholder={placeholder} onBlurSubmit />
        case "checkbox":
            return <ComponentCheckbox article={settings.recipient_property} label={title} className={className} onChangeSubmit />
        default:
            return <ComponentInCreation type={type} />
    }
}

const getFilterKey = (filter: ComponentFilterType) => `${filter.type}-${filter.settings.recipient_property}`

const ComponentFiltersCustomToggle: React.FC<{ children: any, onClick: (value: any) => void }> = React.forwardRef(({ children, onClick }, ref) => {
    const { config } = useLayout()
    const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
        ? 'btn-light'
        : 'btn-color-gray-700 btn-active-color-primary'
    return <a
        href='#'
        className={clsx('btn btn-sm btn-flex fw-bold componentFilters_dropdown', daterangepickerButtonClass)}
        //@ts-ignore
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}

    >
        <KTSVG
            path='/media/icons/duotune/general/gen031.svg'
            className='svg-icon-6 svg-icon-muted me-1'
        />
        {children}
    </a>
})


const ComponentFiltersDropdown: React.FC<ComponentFiltersType> = (props) => {
    const intl = useIntl()
    const initialValues = useMemo(() => props.filterValues ?? {}, [props.filterValues])
    return <div className="componentFilters_dropdownContainer">
        <Dropdown autoClose={false}>
            <Dropdown.Toggle as={ComponentFiltersCustomToggle} id="dropdown-custom-components">
                {intl.formatMessage({ id: "FILTER.DROPDOWN_TITLE" })}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <div className='w-250px w-md-350px componentFilters_dropdownMenu'>
                    <div className='px-7 py-5'>
                        <div className='fs-5 text-dark fw-bolder'>{intl.formatMessage({ id: "FILTER.DROPDOWN_TITLE" })}</div>
                    </div>
                    <div className='separator border-gray-200' />
                    <div className='p-5'>
                        <Formik enableReinitialize initialValues={initialValues} onSubmit={(values) => props.handleChange(values)}>
                            {({ handleSubmit, handleReset }) => {
                                const handleFormReset = () => {
                                    if (props.filterValues) {
                                        return props.handleReset()
                                    } else {
                                        handleReset()
                                        return handleSubmit()
                                    }
                                }
                                return <FormikForm>
                                    <div className="componentFilters_dropdownFiltersContainer">
                                        {props.data.map(filter => <Form.Group
                                            key={getFilterKey(filter)}
                                            as={Col}
                                            md={filter.settings.size ? filter.settings.size * 3 : 12}
                                            className="componentFilters_dropdownFilter"
                                        >
                                            {filter.type !== "checkbox" ? <label className='form-label fw-bold'>{filter.title ?? ""}</label> : null}
                                            <ComponentFilter {...filter} placeholder={filter.placeholder ?? filter.title} />
                                        </Form.Group>)}
                                    </div>
                                    <ComponentButton
                                        type="submit"
                                        settings={{ title: intl.formatMessage({ id: "FILTER.CLEAR_BUTTON" }), background: "dark", icon: "" }}
                                        customHandler={handleFormReset}
                                        disabled={props.isInitials}
                                    />
                                </FormikForm>
                            }}
                        </Formik>
                    </div>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    </div>
}

const ComponentFiltersBlock: React.FC<ComponentFiltersType> = (props) => {
    const intl = useIntl()
    const initialValues = useMemo(() => props.filterValues ?? {}, [props.filterValues])

    return <div className="componentFilters_block">
        <Formik enableReinitialize initialValues={initialValues} onSubmit={(values) => props.handleChange(values)}>
            {({ handleSubmit, handleReset }) => {

                const showClearFilterButton = !props.isInitials

                const handleFormReset = () => {
                    if (props.filterValues) {
                        return props.handleReset()
                    } else {
                        handleReset()
                        return handleSubmit()
                    }
                }

                return <FormikForm className="componentFilters_blockForm">
                    <div className="componentFilters_blockContainer">
                        {props.data.map(filter => <div key={getFilterKey(filter)} className="componentFilters_blockFilter">
                            <ComponentFilter {...filter} placeholder={filter.title ?? ""} />
                        </div>)}
                    </div>
                    {showClearFilterButton ?
                        <ComponentButton
                            type="submit"
                            className="componentFilters_blockButton"
                            settings={{ title: intl.formatMessage({ id: "FILTER.CLEAR_BUTTON" }), background: "light", icon: "trash" }}
                            customHandler={handleFormReset}
                        />
                        : null}
                    <div className="componentFilters_hiddenDropdown">
                        <Dropdown autoClose={false}>
                            <Dropdown.Toggle as={ComponentFiltersCustomToggle} id="dropdown-custom-components">
                                {intl.formatMessage({ id: "FILTER.DROPDOWN_TITLE" })}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <div className='w-250px w-md-300px componentFilters_dropdownMenu'>
                                    <div className='px-7 py-5'>
                                        <div className='fs-5 text-dark fw-bolder'>{intl.formatMessage({ id: "FILTER.DROPDOWN_TITLE" })}</div>
                                    </div>
                                    <div className='separator border-gray-200'></div>
                                    <div className='px-7 py-5'>
                                        {props.data.map(filter => <div key={getFilterKey(filter)} className="componentFilters_dropdownFilter">
                                            {filter.type !== "checkbox" ? <label className='form-label fw-bold'>{filter.title ?? ""}</label> : null}
                                            <ComponentFilter {...filter} />
                                        </div>)}
                                        <ComponentButton
                                            type="submit"
                                            settings={{ title: intl.formatMessage({ id: "FILTER.CLEAR_BUTTON" }), background: "dark", icon: "" }}
                                            customHandler={handleFormReset}
                                            disabled={props.isInitials}
                                        />
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </FormikForm>
            }}
        </Formik>
    </div>
}

const ComponentFiltersString: React.FC<ComponentFiltersType> = (props) => {
    const intl = useIntl()
    const initialValues = useMemo(() => props.filterValues ?? {}, [props.filterValues])

    return <div className="componentFilters_string">
        <Formik enableReinitialize initialValues={initialValues} onSubmit={(values) => props.handleChange(values)}>
            {({ handleSubmit, handleReset }) => {

                const showClearFilterButton = !props.isInitials

                const handleFormReset = () => {
                    if (props.filterValues) {
                        return props.handleReset()
                    } else {
                        handleReset()
                        return handleSubmit()
                    }
                }

                return <FormikForm className="componentFilters_stringForm">
                    {props.data.map(filter => <div key={getFilterKey(filter)} className="componentFilters_stringFilterContainer">
                        <ComponentFilter {...filter} placeholder={filter.title ?? ""} className="componentFilters_stringFilter" />
                    </div>)}
                    {showClearFilterButton ?
                        <ComponentButton
                            type="submit"
                            className="componentFilters_stringButton"
                            settings={{ title: intl.formatMessage({ id: "FILTER.CLEAR_BUTTON" }), background: "light", icon: "trash" }}
                            defaultLabel="icon"
                            customHandler={handleFormReset}
                        />
                        : null}
                    <div className="componentFilters_hiddenDropdown">
                        <Dropdown autoClose={false}>
                            <Dropdown.Toggle as={ComponentFiltersCustomToggle} id="dropdown-custom-components">
                                {intl.formatMessage({ id: "FILTER.DROPDOWN_TITLE" })}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <div className='w-250px w-md-300px componentFilters_dropdownMenu'>
                                    <div className='px-7 py-5'>
                                        <div className='fs-5 text-dark fw-bolder'>{intl.formatMessage({ id: "FILTER.DROPDOWN_TITLE" })}</div>
                                    </div>
                                    <div className='separator border-gray-200'></div>
                                    <div className='px-7 py-5'>
                                        {props.data.map(filter => <div key={getFilterKey(filter)} className="componentFilters_dropdownFilter">
                                            {filter.type !== "checkbox" ? <label className='form-label fw-bold'>{filter.title ?? ""}</label> : null}
                                            <ComponentFilter {...filter} placeholder={filter.placeholder ?? filter.title} />
                                        </div>)}
                                        <ComponentButton
                                            type="submit"
                                            settings={{ title: intl.formatMessage({ id: "FILTER.CLEAR_BUTTON" }), background: "dark", icon: "" }}
                                            customHandler={handleFormReset}
                                            disabled={props.isInitials}
                                        />
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </FormikForm>
            }}
        </Formik>
    </div>
}

const ComponentFilters: React.FC<ComponentFiltersType> = (props) => {
    const filtersCount = props.data.length
    if (props.type === "string") {
        return <ComponentFiltersString {...props} />
    } else if (filtersCount <= 3 && props.type === "block") {
        return <ComponentFiltersBlock {...props} />
    } else {
        return <ComponentFiltersDropdown {...props} />
    }
}

export default ComponentFilters