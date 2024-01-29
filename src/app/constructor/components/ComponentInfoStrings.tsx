import { useField } from "formik"
import { uniq } from "lodash"
import React, { useMemo, useState } from "react"
import ComponentModal from "./ComponentModal"

const ComponentInfoStrings: React.FC<{ article: string }> = ({ article }) => {
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
                const link = value.find(value => value?.title === uniqueValue)?.link
                return { title: uniqueValue, count, link }
            })
            return valuesWithCount
        } else {
            return []
        }
    }, [value])


    return <>
        <div className="componentInfoStrings_list">
            {valueWithCount.map((value, index) => <div key={value.title + index} className={`componentInfoStrings_container${value.link ? " cliackable" : ""}`}>
                <div className="componentInfoStrings form-control form-control-solid">{value.title}</div>
                {value.count > 1 ? <div className="componentInfoStrings_counter form-control form-control-solid">{`x${value.count}`}</div> : null}

            </div>)}
        </div>
        <ComponentModal page={show} show={Boolean(show)} setShow={() => setShow(null)}   />
    </>
}

export default ComponentInfoStrings