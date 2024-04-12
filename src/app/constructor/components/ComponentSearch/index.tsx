import React from "react"
import { KTSVG } from "../../../../_metronic/helpers"
import { useIntl } from "react-intl"
import { TComponentSearch } from "./_types"

const ComponentSearch: React.FC<TComponentSearch> = ({ value, setValue }) => {
    const intl = useIntl()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)
    const handleClick = () => setValue("")
    return <div className="componentSearch_container">
        <input
            className="form-control form-control-solid componentSearch"
            type="text"
            name="search"
            value={value ?? ""}
            onChange={handleChange}
            placeholder={intl.formatMessage({ id: "SEARCH.PLACEHOLDER" })}
            autoComplete="off"

        />
        {value.length ? <button type="button" className="componentSearch_button" onClick={handleClick}>
            <KTSVG path='/media/crm/icons/close.svg' />
        </button> : null}
    </div>
}


export default ComponentSearch