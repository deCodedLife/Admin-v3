import React, { useContext as useReactContext, useMemo, useState, useCallback } from "react"
import { ComponentButtonModalType } from "../../../types/components"
import useItem from "../../../api/hooks/useItem"
import { useFormikContext } from "formik"
import { useModuleContext } from "../../modules/helpers/useModuleContent"
import { ModalContext } from "../../modules/ModuleSchedule/ModuleSchedule"
import ComponentTooltip from "../ComponentTooltip"
import { getLabel } from "."
import { Modal } from "react-bootstrap"
import setModalIndex from "../../helpers/setModalIndex"
import PageBuilder from "../../../page/PageBuilder"


const ComponentButtonModal: React.FC<ComponentButtonModalType> = ({ settings, defaultLabel = "title", className = "", }) => {
    /* 
    insert_to_field - артикул внешней формы, в него подставляется результат отправки внутренней формы
    refresh_after_submit - обновлять ли внешний модуль после отправки внутренней формы
    close_after_submit - закрывать ли модальное окно после отправки внутренней формы
    close_previous_modal - закрывать ли внешнее модальное окно после отправки формы (пример - выбор причины отмены посещения в "Доке")
    */
    const { insert_to_field, refresh_after_submit = false, close_after_submit = true, close_previous_modal = false, modal_size = "xl", context } = settings
    const [showModal, setShowModal] = useState(false)
    const resolvedRequestProps = useMemo(() => Object.assign({ page: settings.page }, context && typeof context === "object" ? { context } : {}), [])
    const { data, isFetching } = useItem("pages", resolvedRequestProps)
    const formContext = useFormikContext<any>()
    const setFieldValue = formContext ? formContext.setFieldValue : null
    const outerFormValues = formContext ? formContext.values : null
    const isModalCentered = modal_size === "sm"

    const moduleContext = useModuleContext()
    const modalContext = useReactContext<any>(ModalContext)

    const isButtonDisabled = !data && !isFetching

    const handleResponse = useCallback((data: any) => {
        if (refresh_after_submit) {
            moduleContext.refresh()
        }
        if (insert_to_field && setFieldValue && outerFormValues) {
            const isArray = insert_to_field.split("_")[0].endsWith("s")
            const resolvedValue = isArray ? Array.isArray(outerFormValues[insert_to_field]) ? [...outerFormValues[insert_to_field], data.data] : [data.data] :
                data.data
            setFieldValue(insert_to_field, resolvedValue)
        }
    }, [])

    const handleClose = useCallback(() => {
        if (close_after_submit) {
            setShowModal(false)
        }
        if (close_previous_modal && modalContext.setShow) {
            modalContext.setShow(false)
        }
    }, [])

    const modalContextValues = useMemo(() => {
        return {
            // коллбэк, выполняемый после отправки формы
            handleResponse,
            //если передать в setShow функцию, то, после отправки формы, закроется модалка
            setShow: handleClose,
            insideModal: true,
            settings: {
                close_after_submit
            }
        }
    }, [])
    return <>
        <ComponentTooltip title={settings.title ?? ""}>
            <button
             className={`componentButton ${className} ${settings.background}`}
              type="button" 
              disabled={isButtonDisabled}
              onClick={() => setShowModal(true)}
              >
                {getLabel(defaultLabel, settings)}
            </button>
        </ComponentTooltip>

        <Modal
            size={modal_size}
            centered={isModalCentered}
            dialogClassName="customModal some_modal"
            show={Boolean(showModal) && Boolean(data)}
            onHide={() => setShowModal(false)}
            onEntering={setModalIndex}
            enforceFocus={false}
        >
            <Modal.Header closeButton className="modal-emptyHeader" />
            <Modal.Body className="scroll-y">
                <ModalContext.Provider value={modalContextValues}>
                    {data ? <PageBuilder data={data} isFetching={isFetching} showProgressBar={false} /> : null}
                </ModalContext.Provider>

            </Modal.Body>
        </Modal>
    </>
}

export default ComponentButtonModal