import React from "react"
import { TComponentDashboard } from "./_types"

const ComponentDashboard: React.FC<TComponentDashboard> = ({ children, inverse = false }) => {
    if (!children) {
        return null
    }
    return <div className={`componentDashboard${inverse ? " inverse" : ""}`}>
        {children}
    </div>
}

export default ComponentDashboard