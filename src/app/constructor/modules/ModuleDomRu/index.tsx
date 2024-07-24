import React, { useEffect, useMemo, useState } from "react"
import useDomRu from "../../../api/hooks/useDomRu"
import { Modal } from "react-bootstrap"
import useItem from "../../../api/hooks/useItem"
import PageBuilder from "../../../pages/PageBuilder"
import { ModalContext } from "../ModuleSchedule"
import { KTSVG } from "../../../../_metronic/helpers"
import setModalIndex from "../../helpers/setModalIndex"
import SplashScreen from "../../helpers/SplashScreen"


const ModuleDomRu: React.FC = () => {
    const { data } = useDomRu()
    const isActiveCall = data && typeof data !== "boolean"
    const isActiveCallWithPage = isActiveCall && data.type === "page"
    const pageRequestData = isActiveCallWithPage ? { page: data.value.slice(1) } : {}
    const [show, setShow] = useState(false)
    const { data: pageData, isFetching } = useItem("pages", pageRequestData, Boolean(isActiveCallWithPage))
    
    useEffect(() => {
        if (isActiveCall) {
            setShow(true)
            return () => setShow(false)
        }
    }, [isActiveCall])


    const modalSize = isActiveCallWithPage ? "xl" : "sm"
    /*
    setShow - временная заглушка. Нужно переделать логику 
     */
    const modalContext = useMemo(() => {
        if (isActiveCallWithPage) {
            const splitedLink = data.value.split("/")
            const id = splitedLink[splitedLink.length - 1]
            return { initialData: { id }, setShow: () => { }, insideModal: true, saveInStorage: false }
        }
        else {
            return {}
        }
    }, [data])
    return <div className="app-navbar-item ms-1 ms-lg-3">
        {
            isActiveCall ? <button className="moduleDomRu_button" onClick={() => setShow(true)}>
                <KTSVG path='/media/crm/icons/phone.svg' className="svg-icon-1" />
            </button> : null
        }

        <ModalContext.Provider value={modalContext}>
            <Modal dialogClassName="customModal" show={show} size={modalSize} onHide={() =>  setShow(false)} onEntering={setModalIndex}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Входящий звонок
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ minHeight: "300px" }}>
                    {
                        isActiveCall ? isActiveCallWithPage ? pageData ?
                            <PageBuilder data={pageData} isFetching={isFetching} showProgressBar={false} /> :
                            <SplashScreen className="default" active /> :
                            `Входящий звонок: ${data.value}` :
                            null
                    }
                </Modal.Body>
            </Modal>
        </ModalContext.Provider>
    </div>
}


export default ModuleDomRu