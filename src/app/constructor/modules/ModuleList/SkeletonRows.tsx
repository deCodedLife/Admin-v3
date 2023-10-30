import React, { useMemo } from "react"
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'


type TSkeletonCell = { type: string }
type TSkeletonRow = {
    headers: Array<{
        title: string;
        article: string;
        type: string;
    }>,
    previousRowsCount?: number,
    isListEditable: boolean
}

const SkeletonCell: React.FC<TSkeletonCell> = ({ type }) => {
    switch (type) {
        case "deleteCheckbox":
            return <td className="moduleList_cell deleteCheckbox">
                <Skeleton className="skeleton" height={20} width={20} />
            </td>
        case "image":
            return <td className="moduleList_cell image">
                <Skeleton className="skeleton" height={45} width={45} />
            </td>
        case "buttons":
            return <td className="moduleList_cell">
                <div className="moduleList_buttonsContainer">
                    <Skeleton className="skeleton" height={35} width={35} />
                    <Skeleton className="skeleton" height={35} width={35} />
                </div>
            </td>
        default:
            return <td className="moduleList_cell">
                <Skeleton className="skeleton" height={16} />
            </td>
    }
}


const SkeletonRows: React.FC<TSkeletonRow> = ({ headers, previousRowsCount, isListEditable }) => {

    const rowsMock = useMemo(() => new Array(previousRowsCount || 1).fill(0).map((row, index) => index), [previousRowsCount])

    return <>
        {rowsMock.map(row => <tr key={row}>
            {
                isListEditable ? <td className="moduleList_cell deleteCheckbox">
                    <Skeleton className="skeleton" height={20} width={20} />
                </td> : null
            }
            {headers.map(cell => <SkeletonCell key={cell.article} type={cell.type} />)}
        </tr>)}
    </>
}

export default SkeletonRows