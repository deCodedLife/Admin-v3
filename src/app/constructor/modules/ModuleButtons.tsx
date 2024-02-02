import React from "react"
import { ModuleButtonsType } from "../../types/modules"
import ComponentButton from "../components/ComponentButton"

const ModuleButtons: React.FC<ModuleButtonsType> = props => {
    const { components } = props
    const { buttons } = components
    const haveButtons = Array.isArray(buttons) && buttons.length
    return <div className="moduleButtons">
        {haveButtons ? buttons.map(button => <ComponentButton key={button.type + button.settings.title} {...button} />) : null}
    </div>
}

export default ModuleButtons