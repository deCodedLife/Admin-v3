import React from "react"

export type TComponentDashboard = {
    children: Array<React.ReactChild | null | Array<React.ReactChild>> | React.ReactChild | null,
    inverse?: boolean
}