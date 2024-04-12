import { Placement } from "react-bootstrap/esm/types"

export type TComponentTooltip = {
    title: string | number | React.ReactElement,
    placement?: Placement,
    tooltipClassName?: string,
    children: React.ReactElement,
}