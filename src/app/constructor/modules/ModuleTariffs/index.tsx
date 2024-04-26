import React, { useEffect, useRef, useState } from "react"
import { TModuleTariffs, TModuleTariffsCard } from "./_types"
import { KTSVG } from "../../../../_metronic/helpers"
import api from "../../../api"
import { declOfNum } from "../../helpers/declOfNum"
import { getSuccessToast } from "../../helpers/toasts"



const ModuleTariffsCard = React.memo<TModuleTariffsCard & { handleTariffClick: (article: string) => void }>(props => {
    const { title, description, price, price_text, old_price, points, article, handleTariffClick } = props
    return <div className="col-xl-4">
        <div className="d-flex h-100 align-items-center">
            <div className="w-100 d-flex flex-column flex-center rounded-3 bg-light bg-opacity-75 py-15 px-10">
                <div className="mb-7 text-center">
                    <h1 className="text-gray-900 mb-5 fw-bolder">{title}</h1>
                    <div className={`moduleTariffs_cardDescription text-gray-600 fw-semibold mb-5${description ? " filled" : ""}`}>{description}</div>
                    <div className="text-center d-flex align-items-center">
                        <span className="fs-3x fw-bold text-primary">{price}</span>
                        <span className="fs-7 fw-semibold opacity-50" style={{ textDecoration: "line-through", alignSelf: "start" }}>{old_price}</span>
                        {" "}
                        <span className="fs-7 fw-semibold opacity-50" style={{ alignSelf: "end", marginBottom: "0.8rem" }}>{price_text}</span>
                    </div>
                </div>
                <div className="w-100 mb-10">
                    {points.map(({ title, is_check }) => <div key={title} className="d-flex align-items-center mb-5">
                        <span className="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">{title}</span>
                        <KTSVG path={`/media/crm/icons/${is_check ? "plus" : "close"}.svg`} className={`moduleTariffs_${is_check ? "successIcon" : "icon"}`} />
                    </div>)}
                </div>
                <button type="button" className="componentButton" onClick={() => handleTariffClick(article)}>
                    Выбрать
                </button>
            </div>
        </div>
    </div>
})

const ModuleTariffs = React.memo<TModuleTariffs>(props => {
    const { settings } = props
    const { title, description, tariffs, article, quantity } = settings
    const counterTitlesArray = quantity?.title
    const [tariffsInfo, setTariffsInfo] = useState(tariffs.reduce<{ [key: string]: { price: number, description: string, old_price: number | null } }>((acc, val) => {
        acc[val.article] = { price: val.price, description: val.description, old_price: val.old_price }
        return acc
    }, {}))

    const [count, setCount] = useState(1)
    const [editMode, setEditMode] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        (async () => {
            if (count) {
                const response = await api("tariffs", "quantity", { tariff_article: article, tariff_quantity: count })
                const actualTariffsInfo = response.data
                setTariffsInfo(prev => {
                    const previousValueClone = { ...prev }
                    for (let tariff in actualTariffsInfo) {
                        previousValueClone[tariff] = Object.assign({}, previousValueClone[tariff], actualTariffsInfo[tariff], { old_price: 300 })
                    }
                    return previousValueClone
                })


            }
        })()
    }, [count])

    const handleTariffClick = (article: string) => {
        getSuccessToast(`Выбран тариф ${article} в кол-ве ${count} шт.`)
    }

    return <div className="modueTariffs_container card">
        <div className="moduleTariffs card-body">
            <div className="d-flex flex-column">
                <div className="mb-13 text-center">
                    <h1 className="fs-2hx fw-bold mb-5">{title}</h1>
                    <div className="text-gray-600 fw-semibold fs-5">{description}</div>
                </div>
                <div className="text-gray-600 fw-semibold fs-5 d-flex mb-15 justify-content-center align-items-center">
                    <button
                        type="button"
                        className={`btn btn-color-gray-600 btn-active btn-active-secondary px-4 py-2 ${count < 2 ? "" : " active"}`}
                        onClick={() => setCount(prev => prev - 1)}
                        disabled={count < 2}
                    >-</button>
                    <div className="moduleTariffs_counterContainer">
                        <input
                            className="moduleTariffs_counterInput form-control form-control-solid"
                            style={{ zIndex: editMode ? 1 : 0, opacity: editMode ? 1 : 0 }}
                            ref={inputRef}
                            type="text" value={count}
                            onChange={event => {
                                const valueAsNumber = Number(event.target.value)
                                if (Number.isInteger(valueAsNumber)) {
                                    setCount(valueAsNumber)
                                }
                            }}
                            onKeyDown={event => {
                                if (event.key === "Enter" || event.key === "Escape") {
                                    setEditMode(false)
                                }
                            }}

                            onBlur={event => {
                                setEditMode(false)
                                if (count === 0) {
                                    setCount(1)
                                }
                            }}
                        />
                        <span className="moduleTariffs_counterContent"
                            style={{ zIndex: !editMode ? 1 : 0, opacity: !editMode ? 1 : 0 }}
                            onClick={() => {
                                setEditMode(true)
                                if (inputRef.current) {
                                    inputRef.current.focus()
                                }
                            }}>{counterTitlesArray ? `${count} ${declOfNum(count, counterTitlesArray)}` : `Кол-во: ${count}`}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="btn btn-color-gray-600 btn-active btn-active-secondary px-4 py-2 active"
                        onClick={() => setCount(prev => prev + 1)}

                    >+</button>
                </div>

                <div className="row g-10">
                    {tariffs.map(tariff => <ModuleTariffsCard
                        key={tariff.article}
                        {...tariff}
                        price={tariffsInfo[tariff.article].price}
                        description={tariffsInfo[tariff.article].description}
                        old_price={tariffsInfo[tariff.article].old_price}
                        handleTariffClick={handleTariffClick}
                    />)}
                </div>
            </div>

        </div>
    </div>
})

export default ModuleTariffs