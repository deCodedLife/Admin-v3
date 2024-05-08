import { Formik, Form as FormikForm, useField, useFormikContext } from 'formik'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useSetupContext } from '../../helpers/SetupContext'
import ru from 'react-phone-number-input/locale/ru.json'
import en from 'react-phone-number-input/locale/en.json'
import { TComponentPhone } from '../ComponentPhone/_types'
import { useAuth } from '../../../modules/auth'
import ComponentButton from '../ComponentButton'
import api from '../../../api'
import { Col, Form, Modal } from 'react-bootstrap'
import setModalIndex from '../../helpers/setModalIndex'
import ComponentSelect from '../ComponentSelect'
import { getErrorToast } from '../../helpers/toasts'
import { useHook } from '../helpers'


const ComponentPhoneV2 = React.memo<TComponentPhone>(props => {
    const { context } = useSetupContext()
    const { currentUser } = useAuth()
    
    const resolvedSettings = useMemo(() => {
        switch (context.phone_format) {
            case "usa":
                return { labels: en, defaultCountry: "US" }
            case "lat":
                return { labels: en, defaultCountry: "LV" }
            case "ru":
            default:
                return { labels: ru, defaultCountry: "RU" }
        }
    }, [context])

    const { article, script, hook, is_disabled, customHandler } = props
    const [field, meta] = useField(article)
    const { name, value, onBlur } = field
    const { values, setFieldValue } = useFormikContext()
    const isError = Boolean(meta.error && meta.touched)

    const setValueForHook = useHook(name, values, setFieldValue, hook)

    const resolvedValue = useMemo(() => {
        if (typeof value === "string") {
            return value.startsWith("+") ? value : "+" + value
        }
    }, [value])

    const showCallButton = Boolean(context.dom_ru && currentUser?.domru_login)
    const isPossiblePhone = isPossiblePhoneNumber(resolvedValue ?? "")


    const [initializeCall, setInitializeCall] = useState(false)

    useEffect(() => {
        if (initializeCall && !script) {
            const id = setTimeout(() => setInitializeCall(false), 3000)
            return () => clearTimeout(id)
        }
    }, [initializeCall])

    const handleMakeCall = () => {
        if (isPossiblePhone && currentUser?.domru_login) {
            api("dom_ru", "make_call", { user: currentUser.domru_login, phone: resolvedValue?.replace(/[^\d]/g, "") })
            setInitializeCall(true)
        }
    }

    const list = useMemo(() => [
        { title: "Да", value: true },
        { title: "Нет", value: false }
    ], [])

    const handleSubmit = useCallback(async (props: { call_status?: boolean }) => {
        try {
            if (!script) {
                throw new Error("Не передан скрипт запроса")
            } else if (props.call_status) {
                await api(script.object, script.command, script.properties)
            }
            setInitializeCall(false)
        } catch (error: any) {
            return getErrorToast(error.message)
        }
    }, [script])

    const handleChange = (value: any) => {
        setFieldValue(article, value)
        if (customHandler) {
            customHandler(resolvedValue)
        }

    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (hook) {
            const resolvedValue = event.target.value.replace(/[^\d]/g, "")
            setValueForHook(resolvedValue)
        }
        onBlur(event)
    }

    return <>
        <div className="componentPhoneV2_container">
            <Modal className="componentPhoneV2_modal" show={initializeCall} onHide={() => setInitializeCall(false)} size="sm" centered onEntering={setModalIndex}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {script ? "Удалось дозвониться?" : "Внимание"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!script && <p>Инициализация звонка</p>}
                    {script && <Formik initialValues={{ call_status: undefined }} onSubmit={handleSubmit}>
                        {() => <FormikForm>
                            <Form.Group as={Col} md={12}>
                                <ComponentSelect article="call_status" data_type="boolean" list={list} onChangeSubmit />
                            </Form.Group>
                        </FormikForm>}
                    </Formik>}
                </Modal.Body>
            </Modal>
            <PhoneInput
                className={`componentPhoneV2 form-control form-control-solid ${isError ? " invalid" : ""} ${showCallButton ? " withButton" : ""}`}
                labels={resolvedSettings.labels}
                //@ts-ignore
                value={resolvedValue}
                onChange={handleChange}
                onBlur={handleBlur}
                //@ts-ignore
                defaultCountry={resolvedSettings.defaultCountry}
                disabled={is_disabled}

            />
            {showCallButton ?
                <ComponentButton
                    className="componentPhoneV2_button"
                    type="custom"
                    settings={{ title: "Инициализировать звонок", icon: "phone", background: "dark" }}
                    defaultLabel="icon"
                    customHandler={handleMakeCall}
                    disabled={!isPossiblePhone}
                /> : null}
        </div>
        {isError ? <div className="invalid_feedback">
            {meta.error}
        </div> : null}
    </>
})

export default ComponentPhoneV2