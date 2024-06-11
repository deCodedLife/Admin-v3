import React from "react"
import { KTSVG } from "../../../../_metronic/helpers"
import ComponentButtonModal from "./src/ComponentButtonModal"
import ComponentButtonPrint from "./src/ComponentButtonPrint"
import ComponentButtonClassic from "./src/ComponentButtonClassic"
import ComponentButtonDrawer from "./src/ComponentButtonDrawer"
import { TComponentButton } from "./_types"

export const getLabel = (defaultLabel: string, settings: any) => {
    switch (defaultLabel) {
        case "icon":
            return <KTSVG path={`/media/crm/icons/${settings.icon ? settings.icon : "plus"}.svg`} />
        default:
            return <span className="componentButton_content">
                {settings.icon ? <KTSVG path={`/media/crm/icons/${settings.icon}.svg`} /> : null}
                {settings.title ?? "Кнопка"}
            </span>
    }
}

const ComponentButton: React.FC<TComponentButton> = (props) => {
    switch (props.type) {
        case "modal":
            return <ComponentButtonModal {...props} />
        case "drawer":
            return <ComponentButtonDrawer {...props} />
        case "print":
            return <ComponentButtonPrint {...props} />
        default:
            return <ComponentButtonClassic {...props} />
    }
}

export default ComponentButton