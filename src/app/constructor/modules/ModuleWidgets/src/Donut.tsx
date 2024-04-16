import React, { useMemo } from "react"
import Chart from "react-apexcharts";
import {TModuleWidgetsDonut} from "../_types";

const DonutModule: React.FC<TModuleWidgetsDonut["settings"]> = ({ char }) => {
    const chartState = useMemo(() => {
        const initialState = {
            options: {
                labels: [] as Array<string>,
                legend: {
                    formatter: (label: string, context: any) => {
                        const valuesArray = context.w.config.series
                        const currentLabelIndex = context.seriesIndex
                        const currentLabelValue = valuesArray[currentLabelIndex]
                        return `${label}: ${currentLabelValue}`
                    },
                    labels: {
                        colors: "inherit",
                        useSeriesColors: false
                    }
                }
            },
            series: [] as Array<number>
        }
        if (char) {
            const values = Object.values<{ title: string, value: number | string }>(char)
            values.forEach(value => {
                initialState.options.labels.push(`${value.title}`)
                initialState.series.push(Number(value.value))
            })
        }
        return initialState
    }, [char])
    return (
        <div className="moduleWidgets_donutModule card card-flush">

            <div className='card-body pt-2 pb-4 d-flex flex-wrap align-items-center'>
                <Chart type='donut' options={chartState.options} series={chartState.series} width={400} />
            </div>
        </div>
    )
}

export default DonutModule