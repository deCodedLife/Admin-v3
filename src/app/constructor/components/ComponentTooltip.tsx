
import React from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { ComponentTooltipType } from "../../types/components"

const ComponentTooltip: React.FC<ComponentTooltipType> = ({ children, title, placement = "auto", tooltipClassName = "" }) => {
    /* position: fixed решает проблему с мерцанием скролла у body */
    return <OverlayTrigger placement={placement} overlay={
        <Tooltip className={`componentTooltip ${tooltipClassName}`} placement="auto">
            {title}
        </Tooltip>
    }>
        {children}
    </OverlayTrigger>
}

export default ComponentTooltip