import React from "react"
import { useIntl } from "react-intl"
import { TComponentInCreation } from "./_types"

const ComponentInCreation: React.FC<TComponentInCreation> = ({ type }) => {
    const intl = useIntl()
    return <div className="componentInCreation">
        {`${intl.formatMessage({ id: "COMPONENT_IN_CREATION.COMPONENT" })} ${type} ${intl.formatMessage({ id: "COMPONENT_IN_CREATION.DESCRIPTION" })}`}
    </div>
}

export default ComponentInCreation