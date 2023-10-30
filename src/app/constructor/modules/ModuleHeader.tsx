import React from "react"
import { ModuleHeaderType } from "../../types/modules"
import ComponentButton from "../components/ComponentButton"



const ModuleHeader: React.FC<ModuleHeaderType> = ({ settings: { title, description }, components }) => {
    const buttons = Array.isArray(components) ? [] : components.buttons

    return <div className="moduleHeader">
        <div className="moduleHeader_properties">
            <div className="moduleHeader_title">
                {title}
            </div>
            <div className="moduleHeader_description">
                {description}
            </div>
        </div>
        <div className="moduleHeader_buttons">
            {buttons.map(button => <ComponentButton key={button.settings.title} {...button} />)}
        </div>
    </div>
}

export default ModuleHeader