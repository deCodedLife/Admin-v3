
import React from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { TComponentTooltip } from "./_types"

const ComponentTooltip: React.FC<TComponentTooltip> = ({ children, title, placement = "auto", tooltipClassName = "", show }) => {
    /* position: fixed решает проблему с мерцанием скролла у body */
    return <OverlayTrigger show={show} placement={placement} overlay={
        <Tooltip className={`componentTooltip ${tooltipClassName}`} placement="auto">
            {title}
        </Tooltip>
    }>
        {children}
    </OverlayTrigger>
}

export default ComponentTooltip