import React, { useState } from "react"
import { KTSVG } from "../../_metronic/helpers"
import { useIntl } from "react-intl"

type TPageError = {
    error: {
        message?: string
    }
}

const ErrorPage: React.FC<TPageError> = ({ error }) => {
    const intl = useIntl()
    const [showDescription, setShowDescription] = useState(false)
    const handleClick = (e: any) => {
        e.preventDefault()
        setShowDescription(prev => !prev)
    }
    return <div className="pageError">
        <div className="pageError_card card">
            <KTSVG path='/media/crm/icons/info.svg' className="pageError_image" svgClassName="" />
            <p className="pageError_text">
                <a href="#" onClick={handleClick}>{intl.formatMessage({ id: "PAGE_ERROR.LINK" })}</a>
                {` ${intl.formatMessage({ id: "PAGE_ERROR.DESCRIPTION" })}`}
            </p>
            <div className={`pageError_description${showDescription ? "" : " hidden"}`}>
                {error.message}
            </div>
        </div>
    </div>
}

export default ErrorPage