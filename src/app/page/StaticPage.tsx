import React from "react"
import { useLocation } from "react-router-dom"
import ModuleInCreation from "../constructor/modules/ModuleInCreation"
import ModuleSchemes from "../constructor/modules/ModuleSchemes"

const Module: React.FC<{
    type: string 
}> = ({type}) => {
    switch (type) {
        case "databaseSchemes":
            return <ModuleSchemes />
        default:
            return <ModuleInCreation type={type} settings={[]} components={[]} size={4}/>
    }
}

const StaticPage: React.FC = () => {
    const { pathname } = useLocation()
    const splitedUrl = pathname.split("/")
    const type = splitedUrl[splitedUrl.length - 1]
    return <div>
        <Module type={type} />
    </div>
}

export default StaticPage