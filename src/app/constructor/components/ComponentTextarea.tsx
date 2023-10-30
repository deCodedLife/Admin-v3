import { useField } from "formik"
import React from "react"
import { ComponentTextareaType } from "../../types/components"

const ComponentTextarea: React.FC<ComponentTextareaType> = ({ article, is_disabled, rows = 18, customHandler }) => {
    const [field, meta] = useField(article)
    const {onChange} = field
    const isError = Boolean(meta.error && meta.touched)
    const handelChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (customHandler) {
            customHandler(event)
        }
        onChange(event)
    }
    return <>
        <textarea
            className={`componentTextarea form-control form-control-solid${isError ? " invalid" : ""}`}
            rows={rows}
            {...field}
            onChange={handelChange}
            disabled={is_disabled}
        />
        {isError ? <div className="invalid_feedback">
            {meta.error}
        </div> : null}
    </>
}

export default ComponentTextarea