import React, { useCallback, useEffect, useState } from "react"
import { KTSVG } from "../../../_metronic/helpers"
import clsx from "clsx"
import { useNavigate } from "react-router-dom"
import { Formik, Form as FormikForm } from "formik"
import ComponentInput from "../components/ComponentInput"
import ComponentButton from "../components/ComponentButton"
import { createPortal } from "react-dom"
import { Col, Form } from "react-bootstrap"
import { JSONTree } from "react-json-tree"
import api, { stringifyRequest } from "../../api"
import { useThemeMode } from "../../../_metronic/partials"
import { getErrorToast, getSuccessToast } from "../helpers/toasts"

type Props = {
    toggleBtnClass?: string
    toggleBtnIconClass?: string
    menuPlacement?: string
    menuTrigger?: string
}

const theme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633',
};

const ModuleRequest: React.FC<{ visible: boolean, handleClose: () => void }> = ({ visible, handleClose }) => {
    const [response, setResponse] = useState(null)
    const { mode } = useThemeMode()

    const handleEscapeKeyClick = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            handleClose()
        }
    }, [])

    useEffect(() => {
        if (visible) {
            document.addEventListener("keydown", handleEscapeKeyClick)
            return () => document.removeEventListener("keydown", handleEscapeKeyClick)
        }

    }, [visible])

    const handleWrapperClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => handleClose(), [])

    return createPortal(<>
        <div className={`moduleDeveloper_requestsWrapper${visible ? " show" : ""}`} onClick={handleWrapperClick} />
        <div className={`moduleDeveloper_requests${visible ? " show" : ""}`}>
            <Formik initialValues={{ request: "" }} onSubmit={async val => {
                const response = await stringifyRequest(val.request)
                setResponse(response.data)
            }}>
                {({ handleSubmit, resetForm }) => <FormikForm className="moduleDeveloper_requestsForm">
                    <Form.Group as={Col} md={10}>
                        <ComponentInput article="request" field_type="string" />
                    </Form.Group>

                    <Form.Group className="moduleDeveloper_requestsButtons" as={Col} md={2}>
                        <ComponentButton type="submit" settings={{ title: "Сброс", icon: "", background: "dark" }} customHandler={() => {
                            resetForm()
                            setResponse(null)
                        }} />
                        <ComponentButton type="submit" settings={{ title: "Отправить", icon: "", background: "dark" }} customHandler={() => handleSubmit()} />
                    </Form.Group>

                </FormikForm>
                }
            </Formik>
            <div className="moduleDeveloper_requestsResponse">
                {response ? <JSONTree data={response} theme={theme} invertTheme={mode === "light"} /> : null}
            </div>
        </div>
    </>, document.body)
}

const ModuleDeveloper: React.FC<Props> = (props) => {
    const { toggleBtnClass = '', toggleBtnIconClass = 'svg-icon-2', menuPlacement = 'bottom-end', menuTrigger = "{default: 'click'}" } = props
    const navigate = useNavigate()

    const [showRequestToolbar, setShowRequestToolbar] = useState(false)

    const handleSchemesButtonClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        navigate("dev/databaseSchemes")
    }, [])

    const handleClearStorage = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        sessionStorage.clear()
        navigate(0)
    }, [])

    const handleUpdateAdminApplication = useCallback(async () => {
        try {
            await api("admin", "update-crm")
            getSuccessToast("Успешно")
        } catch (error: any) {
            getErrorToast(error.message)
        }
    }, [])

    return <>

        <a
            href='#'
            className={clsx('btn btn-icon ', toggleBtnClass)}
            data-kt-menu-trigger={menuTrigger}
            data-kt-menu-attach='parent'
            data-kt-menu-placement={menuPlacement}
        >

            <KTSVG
                path='/media/crm/icons/gear.svg'
                className={clsx('theme-light-hide', toggleBtnIconClass)}
            />


        </a>

        <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-primary fw-semibold py-4 fs-base w-200px'
            data-kt-menu='true'
        >

            <div className='menu-item px-3 my-0'>
                <a
                    href='/dev/databaseSchemes'
                    className={clsx('menu-link px-3 py-2')}
                    onClick={handleSchemesButtonClick}
                >
                    <span className='menu-icon' data-kt-element='icon'>
                        <KTSVG path='/media/crm/icons/files.svg' className='svg-icon-3' />
                    </span>
                    <span className='menu-title'>Схемы</span>
                </a>
            </div>

            <div className='menu-item px-3 my-0'>
                <a
                    href='#'
                    className={clsx('menu-link px-3 py-2')}
                    onClick={handleClearStorage}
                >
                    <span className='menu-icon' data-kt-element='icon'>
                        <KTSVG path='/media/crm/icons/repeat.svg' className='svg-icon-3' />
                    </span>
                    <span className='menu-title'>Очистить фильтры</span>
                </a>
            </div>

            <div className='menu-item px-3 my-0'>
                <a
                    href='#'
                    className={clsx('menu-link px-3 py-2')}
                    onClick={() => setShowRequestToolbar(true)}
                >
                    <span className='menu-icon' data-kt-element='icon'>
                        <KTSVG path='/media/crm/icons/ranking.svg' className='svg-icon-3' />
                    </span>
                    <span className='menu-title'>Отправить запрос</span>
                </a>
            </div>

            <div className='menu-item px-3 my-0'>
                <a
                    href='#'
                    className={clsx('menu-link px-3 py-2')}
                    onClick={handleUpdateAdminApplication}
                >
                    <span className='menu-icon' data-kt-element='icon'>
                        <KTSVG path='/media/crm/icons/repeat.svg' className='svg-icon-3' />
                    </span>
                    <span className='menu-title'>Обновить админку</span>
                </a>
            </div>


            <ModuleRequest visible={showRequestToolbar} handleClose={() => setShowRequestToolbar(false)} />


        </div>

    </>

}

export default ModuleDeveloper