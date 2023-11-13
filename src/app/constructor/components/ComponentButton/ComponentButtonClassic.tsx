import React, {useContext as useReactContext, useState} from "react"
import { ComponentButtonClassicType } from "../../../types/components"
import { useIntl } from "react-intl"
import { useModuleContext } from "../../modules/helpers/useModuleContent"
import { ModalContext } from "../../modules/ModuleSchedule/ModuleSchedule"
import { useNavigate } from "react-router-dom"
import { getErrorToast, getSuccessToast } from "../../helpers/toasts"
import ComponentTooltip from "../ComponentTooltip"
import ComponentButton, { getLabel } from "."
import { Modal } from "react-bootstrap"
import api from "../../../api"
import setModalIndex from "../../helpers/setModalIndex"


const ComponentButtonClassic: React.FC<ComponentButtonClassicType> = ({ type, settings, defaultLabel = "title", className = "", disabled = false, customHandler }) => {
    const intl = useIntl()
    //Переделать !

    //////
    const moduleContext = useModuleContext()
    const modalContext = useReactContext<any>(ModalContext)
    //////

    const navigate = useNavigate()
    const withAttentionModal = settings.attention_modal
    const [showAttentionModal, setShowAttentionModal] = useState(false)
    const isIconBased = defaultLabel === "icon"

    const handleClick = async () => {
        switch (type) {
            case "href":
                return navigate(`${settings.page}`)
            case "submit":
            //внутренний тип приложения
            case "custom":
                return customHandler ? customHandler() : getErrorToast(intl.formatMessage({ id: "BUTTON.HANDLER_ERROR" }))
            case "script":
                try {
                    await api(settings.object, settings.command, settings.data)
                    moduleContext.refresh()
                    getSuccessToast("Успешно")
                    return modalContext.setShow ? modalContext.setShow(false) : () => { }
                } catch (error) {
                    //@ts-ignore
                    return getErrorToast(error.message)
                }
            default:
                return
        }
    }
    return <>
        <ComponentTooltip title={settings.title ?? ""}>
            <button
                className={`componentButton${isIconBased ? " icon_based" : ""} ${className} ${settings.background}`}
                type="button"
                disabled={disabled}
                onClick={withAttentionModal ? () => setShowAttentionModal(true) : handleClick}>
                {getLabel(defaultLabel, settings)}
            </button>
        </ComponentTooltip>

        <Modal show={showAttentionModal} onHide={() => setShowAttentionModal(false)} size="sm" centered onEntering={setModalIndex}>
            <Modal.Header>
                <Modal.Title>
                    {intl.formatMessage({ id: "MODAL.ATTENTION_TITLE" })}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <b>{intl.formatMessage({ id: "MODAL.ATTENTION_DESCRIPTION" })}</b>
            </Modal.Body>
            <Modal.Footer>
                <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: "BUTTON.CANCEL" }), background: "light", icon: "" }}
                    customHandler={() => setShowAttentionModal(false)}
                />
                <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: "BUTTON.SUBMIT" }), background: "dark", icon: "" }}
                    customHandler={() => {
                        handleClick()
                        setShowAttentionModal(false)
                    }} />
            </Modal.Footer>
        </Modal>
    </>
}

export default ComponentButtonClassic
