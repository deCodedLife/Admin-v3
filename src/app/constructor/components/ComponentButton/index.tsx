import React from "react"
import { KTSVG } from "../../../../_metronic/helpers"
import { ComponentButtonType } from "../../../types/components"
import ComponentButtonModal from "./ComponentButtonModal"
import ComponentButtonPrint from "./ComponentButtonPrint"
import ComponentButtonClassic from "./ComponentButtonClassic"

export const getLabel = (defaultLabel: string, settings: any) => {
    switch (defaultLabel) {
        case "icon":
            return <KTSVG path={settings.icon ? `/media/crm/icons/${settings.icon}.svg` : "/media/icons/duotune/general/gen032.svg"} />
        default:
            return <span className="componentButton_content">
                {settings.icon ? <KTSVG path={`/media/crm/icons/${settings.icon}.svg`} /> : null}
                {settings.title ?? "Кнопка"}
            </span>
    }
}

const ComponentButton: React.FC<ComponentButtonType> = (props) => {
    switch (props.type) {
        case "modal":
            return <ComponentButtonModal {...props} />
        case "print":
            return <ComponentButtonPrint {...props} />
        default:
            return <ComponentButtonClassic {...props} />
    }
}

export default ComponentButton