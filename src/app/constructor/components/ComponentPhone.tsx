import { useField, useFormikContext } from "formik"
import React, { useEffect, useMemo, useState } from "react"
import MaskedInput from "react-text-mask"
import { ComponentPhoneType } from "../../types/components"
import { useSetupContext } from "../helpers/SetupContext"
import { getMaskedPhone } from "../modules/helpers"
import { useAuth } from "../../modules/auth"
import ComponentButton from "./ComponentButton"
import api from "../../api"
import { Modal } from "react-bootstrap"
import setModalIndex from "../helpers/setModalIndex"
import { useHook } from "./helpers"

const ComponentPhone: React.FC<ComponentPhoneType> = ({ article, is_disabled, hook, customHandler }) => {
    const applicationContext = useSetupContext()
    const { currentUser } = useAuth()
    const [field, meta] = useField<string>(article)
    const { name, value, onBlur } = field
    const { values, setFieldValue } = useFormikContext()
    const isError = Boolean(meta.error && meta.touched)
    const { mask, placeholder, pure_length } = getMaskedPhone(applicationContext.phone_format)

    const setValueForHook = useHook(name, values, setFieldValue, hook)


    /*
    --- Проверка формата телефона, отображения кнопки звонка и корректности заполненного телефона 
    */
    const isRussianNumberFormat = !applicationContext.phone_format || applicationContext.phone_format === "ru"
    const showCallButton = Boolean(applicationContext.dom_ru && currentUser?.domru_login)
    const isValueInCurrentFormat = value?.length === pure_length


    /*
    --- Состояние для отображения инициализации звонка с автозакрытием  
    */
    const [initializeCall, setInitializeCall] = useState(false)
    useEffect(() => {
        if (initializeCall) {
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
        return String(applicationContext?.phone_format)
    }, [applicationContext])

    return <>
        <Modal show={initializeCall} onHide={() => setInitializeCall(false)} size="sm" centered onEntering={setModalIndex}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Внимание
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Инициализация звонка</p>
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