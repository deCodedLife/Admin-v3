import { useField } from "formik"
import React, { useState } from "react"
import parse from "html-react-parser"
import ComponentButton from "./ComponentButton"
import ComponentTextEditor from "./ComponentTextEditor"
import { useIntl } from "react-intl"

const ComponentLayout: React.FC<{ article: string, is_edit?: boolean }> = ({ article, is_edit = false }) => {
    const intl = useIntl()
    const [isEditMode, setIsEditMode] = useState(false)
    const [field] = useField(article)
    const { value } = field
    const resolvedValue = String(value ?? "")

    return <div className="componentLayout">
        {
        is_edit ?    <ComponentButton
            className="componentLayout_editButton"
            type="custom"
            settings={{ title: intl.formatMessage({ id: isEditMode ? "BUTTON.CLOSE" : "BUTTON.EDIT" }), icon: "", background: "dark" }}
            customHandler={() => setIsEditMode(prev => !prev)}
        /> : null
        }
        {isEditMode ? <ComponentTextEditor article={article} /> : parse(resolvedValue)}
    </div>
}

export default ComponentLayout