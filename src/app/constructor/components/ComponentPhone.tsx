import { Formik, Form as FormikForm, useField, useFormikContext } from "formik"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import MaskedInput from "react-text-mask"
import { ComponentPhoneType } from "../../types/components"
import { useSetupContext } from "../helpers/SetupContext"
import { getMaskedPhone } from "../modules/helpers"
import { useAuth } from "../../modules/auth"
import ComponentButton from "./ComponentButton"
import api from "../../api"
import { Col, Form, Modal } from "react-bootstrap"
import setModalIndex from "../helpers/setModalIndex"
import { useHook } from "./helpers"
import ComponentSelect from "./ComponentSelect"
import { getErrorToast } from "../helpers/toasts"

const ComponentPhone: React.FC<ComponentPhoneType> = ({ article, is_disabled, hook, script, customHandler }) => {
    const { context } = useSetupContext()
    const { currentUser } = useAuth()
    const [field, meta] = useField<string>(article)
    const { name, value, onBlur } = field
    const { values, setFieldValue } = useFormikContext()
    const isError = Boolean(meta.error && meta.touched)
    const { mask, placeholder, pure_length } = getMaskedPhone(context.phone_format)

    const setValueForHook = useHook(name, values, setFieldValue, hook)


    /*
    --- Проверка формата телефона, отображения кнопки звонка и корректности заполненного телефона 
    */
    const isRussianNumberFormat = !context.phone_format || context.phone_format === "ru"
    const showCallButton = Boolean(context.dom_ru && currentUser?.domru_login)
    const isValueInCurrentFormat = value?.length === pure_length


    /*
    --- Состояние для отображения инициализации звонка с автозакрытием  
    */
    const [initializeCall, setInitializeCall] = useState(false)
    useEffect(() => {
        if (initializeCall && !script) {
            const id = setTimeout(() => setInitializeCall(false), 3000)
            return () => clearTimeout(id)
        }
    }, [initializeCall])


    /*
    --- Используем собственный обработчик события, т.к. необходимо зачистить строку от пробелов и привести к числу, но именно на "блюре", 
    т.к. иначе невозможно ввести десятичные числа
    */
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const resolvedValue = event.target.value.replace(/[^\d]/g, "")
        setFieldValue(article, resolvedValue)
        if (customHandler) {
            customHandler(resolvedValue)
        }
        if (hook) {
            setValueForHook(resolvedValue)
        }
        onBlur(event)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let resolvedValue = event.target.value
        if (isRussianNumberFormat) {
            const startNumber = event.target.value.slice(1, 2)
            if (startNumber !== "7" && startNumber !== "_" && startNumber !== "") {
                resolvedValue = event.target.value.slice(0, 1) + "7"
            }
        }
        setFieldValue(article, resolvedValue)
        if (customHandler) {
            customHandler(resolvedValue)
        }

    }

    const handleMakeCall = () => {
        if (isValueInCurrentFormat && currentUser?.domru_login) {
            api("dom_ru", "make_call", { user: currentUser.domru_login, phone: value })
            setInitializeCall(true)
        }
    }
    /*
    --- возможно, иногда маска не успевает сформироваться, а динамически не меняется 
    */
    const uniqueKey = useMemo(() => {
        return String(context?.phone_format)
    }, [context])

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

    return <>
        <Modal show={initializeCall} onHide={() => setInitializeCall(false)} size="sm" centered onEntering={setModalIndex}>
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
        <div className="componentPhone_container">
            <MaskedInput
                key={uniqueKey}
                mask={mask}
                className={`componentPhone form-control form-control-solid${isError ? " invalid" : ""}`}
                type="text"
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={is_disabled}
                placeholder={placeholder}
            />
            {showCallButton ?
                <ComponentButton
                    className="componentPhone_button"
                    type="custom"
                    settings={{ title: "Инициализировать звонок", icon: "phone", background: "dark" }}
                    defaultLabel="icon"
                    customHandler={handleMakeCall}
                    disabled={!isValueInCurrentFormat}
                /> : null}
        </div>

        {isError ? <div className="invalid_feedback">
            {meta.error}
        </div> : null}
    </>
}

export default ComponentPhone