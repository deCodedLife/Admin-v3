import React from "react"
import { useIntl } from "react-intl"

const ComponentInCreation: React.FC<{ type: string }> = ({ type }) => {
    const intl = useIntl()
    return <div className="componentInCreation">
        {`${intl.formatMessage({ id: "COMPONENT_IN_CREATION.COMPONENT" })} ${type} ${intl.formatMessage({ id: "COMPONENT_IN_CREATION.DESCRIPTION" })}`}
    </div>
}

export default ComponentInCreation