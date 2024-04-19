import React, { useCallback } from "react";
import { TModuleListActionButtons, TModuleListCell, TParsedCell } from "../_types";
import moment from "moment";
import { checkDatesInString, getDateFormat, getMaskedString } from "../../helpers";
import ComponentDropdown from "../../../components/ComponentDropdown";
import ComponentButton from "../../../components/ComponentButton";
import { getButtonKey } from "..";
import ComponentAudio from "../../../components/ComponentAudio";
import ComponentTooltip from "../../../components/ComponentTooltip";
import { useSetupContext } from "../../../helpers/SetupContext";
import { useNavigate } from "react-router-dom";

const ModuleListActionButtons: React.FC<TModuleListActionButtons> = ({ data }) => {
    const showActionsAsDropdown = Array.isArray(data) && data.length >= 4
    return <div className="moduleList_buttonsContainer">
        {showActionsAsDropdown ? <ComponentDropdown buttons={data} /> :
            data?.map(button => <ComponentButton key={getButtonKey(button)} {...button} defaultLabel="icon" className="moduleList_actionButton" />)}
    </div>
}

const ParsedCell = React.memo<TParsedCell>(props => {
    const { article, type, row, context, filterable, suffix, handleClick, setIndividualPage, navigate } = props
    const data = row[article]
    
    if (data === null || undefined) {
        return null
    }

    switch (type) {
        case "email":
            return <a href={`mailto:${data}`}>{data}</a>
        case "date":
            return <span
                className={`moduleList_dateCell${data?.color ? ` bg-${data.color}` : ""}`}
            >{data ? moment(data?.value ?? data).format(getDateFormat(type, context, "string")) : null}</span>
        case "time":
            return <span
                className={`moduleList_dateCell${data?.color ? ` bg-${data.color}` : ""}`}
            >{data ? moment(data?.value ?? data).format(getDateFormat(type, context, "string")) : null}</span>
        case "datetime":
            return <span
                className={`moduleList_dateCell${data?.color ? ` bg-${data.color}` : ""}`}
            >{data ? moment(data?.value ?? data).format(getDateFormat(type, context, "string")) : null}</span>
        case "list":
            return Array.isArray(data) ? <>
                {data.map((option, index, array) => {
                    const isLastElement = index === array.length - 1
                    const resolvedKey = JSON.stringify(option) + index

                    return <span key={resolvedKey} className={`moduleList_cellWrapper${option?.color ? ` bg-${option.color}` : ""}`}>
                        <span
                            className={`moduleList_cellData${filterable ? " filterable" : ""}`}
                            onClick={() => handleClick(option.value)}>{`${option.title?.trim()}${isLastElement ? "" : ", "}`}</span>
                    </span>
                })}
            </> :
                <span className={`moduleList_cellWrapper${data?.color ? ` bg-${data.color}` : ""}`}>
                    <span
                        className={`moduleList_cellData${filterable ? " filterable" : ""}`}
                        onClick={() => handleClick(data?.value)}>
                        {data?.title}
                    </span>
                </span>
        case "buttons":
            return <ModuleListActionButtons data={data} />
        case "phone":
            return <span>{getMaskedString(data, type, context)}</span>
        case "price":
            if (data && typeof data === "object") {
                return <div>
                    <span>{getMaskedString(data?.new_price, type, context)}</span>
                    <sup style={{ textDecoration: "line-through" }}>{getMaskedString(data?.old_price, type, context)}</sup>
                </div>
            } else {
                const resolvedClassName = `moduleList_priceCell ${data < 0 ? "negative" : ""} ${(data || typeof data === "number") ? "" : " paddingless"}`
                return <div className={resolvedClassName}>{getMaskedString(data, type, context)}</div>
            }
        case "float":
        case "integer":
            return <span
                className={`moduleList_cellData${filterable ? " filterable" : ""}`}
                onClick={() => handleClick(data)}>{getMaskedString(data, type, context, suffix)}</span>
        case "image":
            const isImage = data?.includes("https")
            return <div className="moduleList_cellImageContainer">
                {isImage ? <img className="moduleList_cellImage" src={data} alt={`${row.id}_${article}`} /> : null}
            </div>
        case "checkbox":
            const resolvedValue = data === true ? "Да" : "Нет"
            return <span>{resolvedValue}</span>
        case "audio_player": {
            return <ComponentAudio src={data} />
        }
        case "link_list":
            return Array.isArray(data) ? <>
                {data.map((option, index, array) => {
                    const isLastElement = index === array.length - 1
                    return <span
                        key={option.value + index}
                        className={`moduleList_linkCell${!option?.href ? " disabled" : ""}`}
                        onClick={() => option?.href ? setIndividualPage(option.href) : null}>{`${option.title?.trim()}${isLastElement ? "" : ", "}`}</span>
                })}
            </> :
                <span
                    className={`moduleList_linkCell${!data?.href ? " disabled" : ""}`}
                    onClick={() => data?.href ? setIndividualPage(data.href) : null}>
                    {data?.title}
                </span>
        case "link":
            return <span className={`moduleList_linkCell${!data?.href ? " disabled" : ""}`} onClick={() => data?.href ? navigate(data.href) : null}>{data?.title}</span>
        case "color_list":
            return Array.isArray(data) ? <>
                {data.map(option => {
                    return <ComponentTooltip key={option.value} title={option.title}>
                        <span className="moduleList_cellWrapper">
                            <span style={{ backgroundColor: option.value }} className="moduleList_colorCell" onClick={() => handleClick(option.value)} />
                        </span>
                    </ComponentTooltip>
                })}
            </> :
                <ComponentTooltip title={data.title}>
                    <span className="moduleList_cellWrapper">
                        <span style={{ backgroundColor: data.value }} className="moduleList_colorCell" onClick={() => handleClick(data.value)} />
                    </span>
                </ComponentTooltip>
        default:
            return Array.isArray(data) ? <>
                {data.map((item, index, array) => {
                    const isLastElement = index === array.length - 1
                    const isItemAsObject = item && typeof item === "object"
                    const resolvedKey = (isItemAsObject ? JSON.stringify(item) : `${item}`) + index

                    return <span key={resolvedKey} className="moduleList_cellWrapper">
                        <span
                            className={`moduleList_cellData${filterable ? " filterable" : ""}`}
                            onClick={() => handleClick(isItemAsObject ? item.value : item)}>
                            {`${isItemAsObject ? item.title : item}${isLastElement ? "" : ", "}`}
                        </span>
                    </span>
                })}
            </>
                :
                <span
                    className={`moduleList_cellData${filterable ? " filterable" : ""}`}
                    onClick={() => handleClick(data?.value ?? data)}>{checkDatesInString(data?.title ?? data)}
                </span>
    }
})

const nonClickableCellsTypes = ["email", "phone", "buttons", "audio_player", "link", "link_list"]

export const ListCell: React.FC<TModuleListCell> = props => {
    const { article, type, row, page, filterable, suffix, setFilter, setIndividualPage } = props
    const { context } = useSetupContext()
    const navigate = useNavigate()

    const isDataAsHref = !(nonClickableCellsTypes.includes(type) || filterable) && page

    const handleCellClick = useCallback(() => {
        const navigateToInfoPage = row?.row_href_type === "info"
        return isDataAsHref ? navigate(`${page}/${navigateToInfoPage ? "info" : "update"}/${row.id}`) : null
    }, [isDataAsHref, page])

    const handleCellDataClick = useCallback((value: string | number | boolean) => {
        if (filterable) {
            return setFilter((prevFilter: any) => Object.assign({}, prevFilter, { [article]: value }))
        } else {
            return
        }
    }, [filterable])

    return <td className={`moduleList_cell ${type} ${isDataAsHref ? " link" : ""}`} onClick={handleCellClick}>
        <ParsedCell
            article={article}
            type={type}
            row={row}
            context={context}
            filterable={filterable}
            suffix={suffix}
            handleClick={handleCellDataClick}
            navigate={navigate}
            setIndividualPage={setIndividualPage}
        />
    </td>
}