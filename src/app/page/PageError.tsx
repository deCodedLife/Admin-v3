import React, { useState } from "react"
import { KTSVG } from "../../_metronic/helpers"
import { ComponentErrorType } from "../types/components"
import { useIntl } from "react-intl"

const PageError: React.FC<ComponentErrorType> = ({error}) => {
    const intl = useIntl()
    const [showDescription, setShowDescription] = useState(false)
    const handleClick = (e: any) => {
        e.preventDefault()
        setShowDescription(prev => !prev)
    }
    return <div className="pageError">
        <div className="pageError_card card">
            <KTSVG   path='/media/crm/icons/info.svg' className="pageError_image" svgClassName=""/>
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

export default PageError