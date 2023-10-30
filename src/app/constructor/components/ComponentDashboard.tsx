import React from "react"
import { ComponentDashboardType } from "../../types/components"

const ComponentDashboard: React.FC<ComponentDashboardType> = ({ children, inverse = false }) => {
    if (!children) {
        return null
    }
    return <div className={`componentDashboard${inverse ? " inverse" : ""}`}>
        {children}
    </div>
}

export default ComponentDashboard