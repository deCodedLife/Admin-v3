import React, { useEffect, useMemo, useRef, useState } from "react"
import useSalary from "../../api/hooks/useSalary"
import { ProgressBar } from "react-bootstrap"
import { SalaryProgressbarType, SalaryRangeType, SalaryType } from "../../types/global"
import { KTSVG, toAbsoluteUrl } from "../../../_metronic/helpers"
import ComponentTooltip from "../components/ComponentTooltip"
import usePrevious from "../helpers/usePrevious"
import { isEqual } from "lodash"


const ModuleSalaryProgressbar: React.FC<SalaryProgressbarType> = ({ values }) => {
    const currentActualValue = useMemo(() => {
        const filteredValues = values.filter(value => value.percent < 100)
        return filteredValues.length ? filteredValues[0] : values[0]
    }, [values])

    if (!currentActualValue) {
        return null
    }
    return <div className="moduleSalaryWidgets_progressbarWidget">
        <div className="moduleSalaryWidgets_title">{currentActualValue.title}</div>
        <ComponentTooltip
            tooltipClassName="centered"
            placement="bottom"
            title={
                <div>
                    <div>Выполнено {currentActualValue.percent}% от KPI</div>
                    <div> Будет начислено <b>{currentActualValue.reward}</b></div>
                </div>
            }>
            <ProgressBar variant="primary" now={currentActualValue.percent} />
        </ComponentTooltip>
    </div>
}

const ModuleSalaryRange: React.FC<SalaryRangeType> = ({ values }) => {
    const currentActualValue = useMemo(() => {
        const filteredValues = values.filter(value => value.current < value.reach)
        return filteredValues.length ? filteredValues[0] : values[0]
    }, [values])

    if (!currentActualValue) {
        return null
    }

    return <div className="moduleSalaryWidgets_rangeWidget">
        <ComponentTooltip
            tooltipClassName="centered"
            placement="bottom"
            title={
                <div>
                    <div><b>{currentActualValue.title}</b></div>
                    <div>Продано {currentActualValue.current} услуг</div>
                    <div>Будет начислено <b>{currentActualValue.reward}</b></div>
                </div>
            }>
            <div className="moduleSalaryWidgets_range">
                {currentActualValue.current} / {currentActualValue.reach}
            </div>
        </ComponentTooltip>
    </div>
}


const ModuleSalaryWidget: React.FC<{ salary: SalaryType }> = ({ salary }) => {
    switch (salary.type) {
        case "progressbar":
            return <ModuleSalaryProgressbar {...salary} />
        case "range":
            return <ModuleSalaryRange {...salary} />
        default:
            return null
    }

}
const ModuleSalaryWidgets: React.FC = () => {
    const { data } = useSalary()

    const resolvedData = useMemo(() => {
        if (Array.isArray(data)) {
            return data.filter(salary => salary?.values?.length)
        } else {
            return null
        }
    }, [data])

    const previousValue = usePrevious(resolvedData)
    const audioRef = useRef<HTMLAudioElement | null>(null)


    /*
    --- Состояние активного виджета и переход на отображение следующего виджета (типа) зарплаты 
    */
    const [currentSlaryIndex, setCurrentSalaryIndex] = useState(0)
    const handleSwitchSalary = () => setCurrentSalaryIndex(prev => {
        if (resolvedData) {
            return resolvedData.length > prev + 1 ? prev + 1 : 0
        } else {
            return prev
        }
    })

    useEffect(() => {
        if (Array.isArray(previousValue) && !isEqual(resolvedData, previousValue)) {
            audioRef.current?.play()
        }
    }, [resolvedData])
    
    if (!resolvedData || !resolvedData?.length) {
        return null
    }
    
    return <div className="moduleSalaryWidgets">
        <audio ref={audioRef} src={toAbsoluteUrl("/media/crm/sounds/kpi.mp3")} />
        {
            resolvedData.length > 1 ? <button className="moduleSalaryWidgets_switchSalaryButton" type="button" onClick={handleSwitchSalary}>
                <KTSVG path='/media/crm/icons/arrow_2.svg' />
            </button> : null
        }
        <ModuleSalaryWidget salary={resolvedData[currentSlaryIndex]} />
    </div>



}

export default ModuleSalaryWidgets