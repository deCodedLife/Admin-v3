import moment from "moment"
import React from "react"
import { ComponentInfoType } from "../../types/components"
import { getMaskedString } from "../modules/helpers"
import { useSetupContext } from "../helpers/SetupContext"

const ComponentInfo: React.FC<ComponentInfoType> = ({ value, field_type }) => {
    const context = useSetupContext()
    if (Array.isArray(value) ? value.length : value) {
        switch (field_type) {
            case "email":
                return <a href={`mailto:${value}`}>
                    <div className="componentInfo">{value}</div>
                </a>
            case "phone":
            case "price":
                return <div className="componentInfo">{getMaskedString(String(value), field_type, context)}</div>
            case "date":
                return <div className="componentInfo">{moment(value).format("DD.MM.YYYY")}</div>
            case "time":
                return <div className="componentInfo">{moment(value, "HH:mm").format("HH:mm")}</div>
            case "datetime":
                return <div className="componentInfo">{moment(value).format("DD.MM.YYYY HH:mm")}</div>
            default:
                return <div className="componentInfo">{Array.isArray(value) ? value.map((item, index) => `${item}${index < value.length - 1 ? ", " : ""}`) : value}</div>
        }
    } else {
        return <div className="componentInfo">-</div>
    }
    
}

export default ComponentInfo