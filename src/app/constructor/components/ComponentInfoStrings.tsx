import { useField } from "formik"
import { uniq } from "lodash"
import React, { useMemo } from "react"

const ComponentInfoStrings: React.FC<{article: string}> = ({article}) => {
    const [field] = useField(article)
    const {value} = field

    const valueWithCount = useMemo(() => {
        if (Array.isArray(value) && value.length) {
            const uniqueValues = uniq(value)
            const valuesWithCount = uniqueValues.map((uniqueValue: string) => {
                const count = value.filter((initialValue: string) => initialValue === uniqueValue).length
                return {title: uniqueValue, count}
            })
            return valuesWithCount
        } else {
            return []
        }
    }, [value])

    return <div className="componentInfoStrings_list">
         {valueWithCount.map((value, index) => <div key={value.title + index} className="componentInfoStrings_container">
            <div className="componentInfoStrings form-control form-control-solid">{value.title}</div>
            {value.count > 1 ? <div className="componentInfoStrings_counter form-control form-control-solid">{`x${value.count}`}</div> : null}
            
         </div>)}
    </div>
}

export default ComponentInfoStrings