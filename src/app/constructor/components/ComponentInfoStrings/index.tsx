import { useField } from "formik"
import { uniq } from "lodash"
import React, { useCallback, useMemo, useState } from "react"
import ComponentModal from "../ComponentModal"
import { TComponentInfoStrings, TField } from "./_types"


const Field = React.memo<TField>(props => {
    const { title, link, count, handleClick } = props
    const resolvedClassName = `componentInfoStrings form-control form-control-solid${link ? " clickable" : ""}`

    return <div className="componentInfoStrings_container">
        <div className={resolvedClassName} onClick={() => handleClick(link)}>{title}</div>
        {count > 1 ? <div className="componentInfoStrings_counter form-control form-control-solid">{`x${count}`}</div> : null}
    </div>
})

const ComponentInfoStrings: React.FC<TComponentInfoStrings> = ({ article }) => {
    const [field] = useField(article)
    const { value } = field
    const [show, setShow] = useState<string | null>(null)

    const valueWithCount = useMemo(() => {
        if (Array.isArray(value) && value.length) {
            const resolvedValue = value.map(item => item?.title ?? item)
            const uniqueValues = uniq(resolvedValue)
            const valuesWithCount = uniqueValues.map((uniqueValue: string) => {
                const count = value
                    .filter((initialValue: { title: string, link?: string } | string) => uniqueValue === (typeof initialValue === "object" ? initialValue.title : initialValue)).length
                const link = value.find(value => value?.title === uniqueValue)?.link as string | undefined
                return { title: uniqueValue, count, link }
            })
            return valuesWithCount
        } else {
            return []
        }
    }, [value])

    const handleClick = useCallback((link?: string) => {
        if (link) {
            setShow(link)
        }
    }, [])


    return <>
        <div className="componentInfoStrings_list">
            {valueWithCount.map((value, index) => <Field key={value.title + index} {...value} handleClick={handleClick} />)}
        </div>
        <ComponentModal page={show} show={Boolean(show)} setShow={() => setShow(null)} />
    </>
}

export default ComponentInfoStrings