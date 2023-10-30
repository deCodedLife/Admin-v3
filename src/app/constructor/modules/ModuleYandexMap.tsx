import React, { useMemo } from "react"
import { YMaps, Map, Clusterer, Placemark } from "react-yandex-maps"
import { ModuleYandexMapType } from "../../types/modules"
import useItem from "../../api/hooks/useItem"
import { useFilter } from "./helpers"
import ComponentFilters from "../components/ComponentFilters"

const mockData = [
    "55.75, 37.57",
    "55.75, 37.47",
    "55.75, 37.37",
    "55.75, 37.27",
    "55.75, 37.17",
    "55.75, 37.07",
    "55.75, 37.67",
    "55.75, 37.77",
    "55.75, 37.87",
]

const ModuleYandexMap: React.FC<ModuleYandexMapType> = (props) => {
    const { settings, components } = props
    const { object, filters: initialFilters } = settings
    const initialFiltersValues = Object.assign({}, initialFilters)
    const { filter, isInitials, setFilter, resetFilter } = useFilter(`${props.type}_${settings.object}`, initialFiltersValues)
    const { data } = useItem<Array<{ title: string, geolocation: string, url: string }>>(object, filter, Boolean(object))
    const resolvedPoints = useMemo(() => {
        return Array.isArray(data) ? data.map(({ url, geolocation, title }) => {
            const resolvedGeolocation = geolocation
                .replace(",", "")
                .split(" ")
                .map(coord => Number(coord))
                .reverse()
            return {
                url,
                title,
                geolocation: resolvedGeolocation
            }
        }) : []
    }, [data])
    const initialMapCenter = resolvedPoints.length ? resolvedPoints[0].geolocation : [55.75, 37.57]
    const haveFilter = Boolean(components?.filters)
    return <div className="moduleYandexMap" style={{ minHeight: "300px" }}>
        {haveFilter ? <ComponentFilters
            type="dropdown"
            data={components.filters}
            filterValues={filter}
            isInitials={isInitials}
            handleChange={setFilter}
            handleReset={resetFilter}
        /> : null}
        <YMaps query={{ apikey: "99d27a37-a2bc-4a4a-ac4f-99ad602977f3" }}>
            <Map
                state={{ center: initialMapCenter, zoom: 6 }}
                modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
                width="100%"
                height={600}
            >
                <Clusterer>
                    {resolvedPoints.map(point => <Placemark
                        key={point.url}
                        geometry={point.geolocation}
                        properties={{ iconCaption: point.title, balloonContent: `<a href=${point.url} target=_blank>${point.title}</a>`, }}
                    />)}
                </Clusterer>
            </Map>
        </YMaps>
    </div>
}

export default ModuleYandexMap