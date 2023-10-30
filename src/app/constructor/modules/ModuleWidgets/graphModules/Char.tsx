import moment from "moment"
import React, { useMemo } from "react"
import { getCSSVariableValue } from "../../../../../_metronic/assets/ts/_utils"
import { ModuleWidgetsCharModule } from "../../../../types/modules"
import Chart from "react-apexcharts"

const CharModule: React.FC<ModuleWidgetsCharModule["settings"] & { withDetails: boolean }> = ({ char, withDetails, value_title }) => {
    const { x, lines } = char

    const resolvedXLine = useMemo(() => {
        return x ? char.x.map(title => title.match(/\d+-\d+-\d/g) ? moment(title).format("DD.MM.YY г.") : title) : []
    }, [x])

    const resolvedLines = useMemo(() => {
        return lines ? lines.map(line => ({ name: line.title, data: Object.values(line.values) })) : []
    }, [lines])
    
    const basicColors = ["--kt-primary", "--kt-success", "--kt-warning", "--kt-danger", "--kt-info", "--kt-secondary"]

    const resolvedColors = useMemo(() => basicColors.map(color => getCSSVariableValue(color)), [])

    if (!resolvedLines.length || !resolvedXLine.length) {
        return null
    }

    return <Chart
        height={250}
        type='area'
        series={resolvedLines}
        options={{
            chart: {
                fontFamily: 'inherit',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
                sparkline: {
                    enabled: !withDetails,
                },
            },
            fill: {
                type: 'solid',
                opacity: 0.3,
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
                show: true,
                width: 2,
                colors: resolvedColors,
            },
            xaxis: {
                offsetX: 0,
                offsetY: 0,
                categories: resolvedXLine,
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: withDetails,
                    style: {
                        fontSize: '12px',
                    },
                },
                crosshairs: {
                    show: withDetails,
                    position: 'front',
                    stroke: {
                        width: 1,
                        dashArray: 3,
                    },
                },
                tooltip: {
                    enabled: withDetails,
                    formatter: undefined,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                    },
                },
            },
            yaxis: {
                labels: {
                    show: withDetails,
                    style: {
                        fontSize: '12px',
                    },
                },

            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0,
                    },
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0,
                    },
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0,
                    },
                },
            },
            tooltip: {
                style: {
                    fontSize: '12px',
                },
                y: {
                    formatter: function (val) {
                        return `${val}`
                    },
                },
            },
            colors: resolvedColors,

            markers: {
                colors: resolvedColors,
                strokeColors: resolvedColors,
                strokeWidth: 3,
            },
            legend: {
                show: resolvedLines.length > 1,
                position: "top",
                horizontalAlign: 'left',
                labels: {
                    colors: "inherit"
                }
            
            },
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: withDetails ? 10 : 0,
                    right: 0,
                },
                yaxis: {
                    lines: {
                        show: withDetails
                    }
                },
            }
        }}
    />
}

export default CharModule