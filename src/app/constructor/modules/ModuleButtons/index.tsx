import React from "react"
import ComponentButton from "../../components/ComponentButton"
import { TModuleButtons } from "./_types"

const ModuleButtons: React.FC<TModuleButtons> = props => {
    const { components } = props
    const { buttons } = components
    const haveButtons = Array.isArray(buttons) && buttons.length
    return <div className="moduleButtons">
        {haveButtons ? buttons.map(button => <ComponentButton key={button.type + button.settings.title} {...button} />) : null}
    </div>
}

export default ModuleButtons