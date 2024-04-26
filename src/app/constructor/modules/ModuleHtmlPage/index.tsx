import React from "react";
import { TModuleHtmlPage } from "./_types";
import { unescape } from "lodash";
import parse from "html-react-parser"

const ModuleHtmlPage = React.memo<TModuleHtmlPage>(props => {
    const { settings } = props
    const { body } = settings
    return <div className="moduleHtmlPage_container card">
        <div className="moduleHtmlPage card-body">
        {parse(unescape(body))}
    </div>
    </div>
})

export default ModuleHtmlPage