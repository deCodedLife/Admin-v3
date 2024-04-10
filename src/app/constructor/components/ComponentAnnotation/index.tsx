import React from "react"
import { OverlayTrigger, Popover } from "react-bootstrap"
import { KTSVG } from "../../../../_metronic/helpers"
import { useIntl } from "react-intl"
import { TComponentAnnotation } from "./_types"

const ComponentAnnotation: React.FC<TComponentAnnotation> = ({ annotation, placement = "auto" }) => {
    const intl = useIntl()
    return <OverlayTrigger
        placement={placement}
        overlay={
            <Popover className="componentPopover" id="popover-basic">
                <Popover.Header as="h3">{intl.formatMessage({id: "ANNOTATION.TITLE"})}</Popover.Header>
                <Popover.Body>{annotation}</Popover.Body>
            </Popover>
        }>
        <span className="componentAnnotation">
            <KTSVG path="/media/crm/icons/question.svg" />
        </span>
    </OverlayTrigger>
}

export default ComponentAnnotation