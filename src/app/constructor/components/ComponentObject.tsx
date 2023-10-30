import { Formik, useField, Form as FormikForm, useFormikContext } from "formik"
import React, { useCallback, useMemo, useState } from "react"
import { Modal, Form, Col } from "react-bootstrap"
import ComponentButton from "./ComponentButton"
import ComponentInput from "./ComponentInput"
import ComponentSelect from "./ComponentSelect"
import * as Yup from 'yup';
import { useIntl } from "react-intl"
import setModalIndex from "../helpers/setModalIndex"

const ComponentObject: React.FC<{ article: string, keysList?: Array<any> }> = ({ article, keysList }) => {
    const intl = useIntl()
    const [showModal, setShowModal] = useState(false)
    const [selectedValue, setSelectedValue] = useState<{ key: string, value: string } | null>(null)
    const [field] = useField(article)
    const { setFieldValue } = useFormikContext<any>()

    const currentValues = useMemo(() => {
        if (typeof field.value === "object" && field.value) {
            const valueAsArray = Object.entries<string>(field.value)
            return valueAsArray.map(([key, value]) => ({ key, value }))
        } else {
            return []
        }

    }, [field])

    const handleClose = useCallback(() => {
        setShowModal(false)
        setSelectedValue(null)
    }, [])

    const handleSubmit = useCallback((formValues: { key: string, value: string }) => {
        const currentValues = field.value ? { ...field.value } : {}
        currentValues[formValues.key] = formValues.value
        setFieldValue(article, currentValues)
        handleClose()
    }, [field])

    const handleDelete = useCallback(() => {
        const currentValues = { ...field.value }
        if (selectedValue) {
            delete currentValues[selectedValue?.key]
        }
        setFieldValue(article, currentValues)
        handleClose()
    }, [selectedValue])

    const handleClick = useCallback((value: { key: string, value: string }) => {
        setSelectedValue(value)
        setShowModal(true)
    }, [])

    return <div className="componentObject">
        {currentValues.map(value => <div
            key={value.key}
            className="componentObject_item"
            onClick={() => handleClick(value)}
        >{`${value.key}: ${value.value}`}</div>)}
        <ComponentButton
            type="custom"
            className="componentObject_button"
            settings={{ title: intl.formatMessage({ id: "OBJECT.APPEND_BUTTON" }), background: "dark", icon: "" }}
            customHandler={() => setShowModal(true)}
        />
        <Modal show={showModal} onHide={handleClose} centered onEntering={setModalIndex}>
            <Modal.Header>
                <Modal.Title>{intl.formatMessage({ id: "MODAL.APPEND_TITLE" })}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={selectedValue ?? { key: "", value: "" }}
                    validationSchema={Yup.object().shape({
                        key: Yup.string().required(" "),
                        value: Yup.string().required(" ")
                    })}
                    onSubmit={(values, { resetForm }) => {
                        handleSubmit(values)
                        resetForm()
                    }}>
                    {({ handleSubmit }) => <FormikForm>
                        {
                            !selectedValue ? <Form.Group className="componentObject_formField" as={Col} md={12}>
                                <label>{intl.formatMessage({ id: "OBJECT.PROPERTY_LABEL" })}</label>
                                {keysList ? <ComponentSelect article="key" data_type="string" list={keysList} /> : <ComponentInput article="key" field_type="string" />}
                            </Form.Group> : null
                        }
                        <Form.Group className="componentObject_formField" as={Col} md={12}>
                            <label>{intl.formatMessage({ id: "OBJECT.VALUE_LABEL" })}</label>
                            <ComponentInput article="value" field_type="string" />
                        </Form.Group>
                        <div className="componentObject_formButtons">
                            <ComponentButton
                                type="submit"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.SUBMIT" }), background: "dark", icon: "" }}
                                customHandler={handleSubmit}
                            />
                            {selectedValue ? <ComponentButton
                                type="custom"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.DELETE" }), background: "danger", icon: "" }}
                                customHandler={handleDelete}
                            /> : null}
                        </div>

                    </FormikForm>}
                </Formik>
            </Modal.Body>
        </Modal>
    </div>
}

export default ComponentObject