import { useField } from "formik"
import React, { useCallback } from "react"
import { TComponentTextarea, TField } from "./_types"

const Field = React.memo<TField>(props => {
    const { article, resolvedClassName, value, rows, handleChange, handleBlur, is_disabled, isError, error } = props

    return <>
        <textarea
            name={article}
            value={value}
            className={resolvedClassName}
            rows={rows}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={is_disabled}
        />
        {isError ? <div className="invalid_feedback">
            {error}
        </div> : null}
    </>
})

const ComponentTextarea: React.FC<TComponentTextarea> = ({ article, is_disabled, rows = 4, customHandler }) => {
    const [field, { error, touched }] = useField(article)
    const { onChange, onBlur, value } = field
    const isError = Boolean(error && touched)

    const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        return customHandler ? customHandler(event) : onChange(event)
    }, [])


    const resolvedClassName = `componentTextarea form-control form-control-solid${isError ? " invalid" : ""}`
    return <Field
        resolvedClassName={resolvedClassName}
        article={article}
        value={value}
        rows={rows}
        handleChange={handleChange}
        handleBlur={onBlur}
        isError={isError}
        is_disabled={is_disabled}
        error={error}
    />
}

export default ComponentTextarea