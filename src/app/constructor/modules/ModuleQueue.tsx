import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ModuleQueueTalonType, ModuleQueueType } from "../../types/modules"
import { useAuth } from "../../modules/auth"
import moment from "moment"
import ComponentSelect from "../components/ComponentSelect"
import { useFilter } from "./helpers"
import { Formik, Form as FormikForm } from "formik"
import { ComponentFilterListType } from "../../types/components"
import ComponentButton from "../components/ComponentButton"
import useQueue from "../../api/hooks/useQueue"
import api, { getApiUrl } from "../../api"
import { useIntl } from "react-intl"


const Filters: React.FC<{ filters: Array<ComponentFilterListType>, initialValues: any, handleChange: (values: any) => void }> = ({ filters, initialValues, handleChange }) => {
    return <div className="moduleQueue_filters">
        <Formik enableReinitialize initialValues={initialValues} onSubmit={(values) => handleChange(values)}>
            {() => <FormikForm>
                {filters.map(({ settings, placeholder, title }) => <ComponentSelect
                    key={settings.recipient_property}
                    prefix="moduleQueue_filter"
                    article={settings.recipient_property}
                    data_type="string"
                    placeholder={placeholder ?? title}
                    list={settings.list ?? []}
                    isMulti={false}
                    onChangeSubmit
                    menuPortal={false}
                    isSearchable={false}
                />)}

            </FormikForm>}
        </Formik>
    </div>
}

const ModuleQueueTalon: React.FC<ModuleQueueTalonType> = (props) => {
    const { talon, cabinet, detail } = props
    return <div className="moduleQueue_talonRow">
        <div className="moduleQueue_talon">{talon}</div>
        <div className="moduleQueue_direction">{"->"}</div>
        <div className="moduleQueue_cabinet">{cabinet}</div>
        <div className="moduleQueue_detail">{detail.map(string => <span key={string}>{string}</span>)}</div>
    </div>
}

const ModuleQueue: React.FC<ModuleQueueType> = (props) => {
    const { currentUser } = useAuth()
    const intl = useIntl()
    const { settings, components } = props
    const { filters } = components
    const { object } = settings
    const haveFilters = Boolean(filters) && filters.length


    /*
    --- Полноэкранный режим 
    */
    const moduleRef = useRef<HTMLDivElement | null>(null)
    const handleFullscreenButtonClick = useCallback(() => {
        return Boolean(document.fullscreenElement) ? document.exitFullscreen() : moduleRef.current?.requestFullscreen()
    }, [])


    /*
    --- Фильтрация и проверка на то, есть ли обязательное значение store_id для запроса 
    */
    const initialFilterValues = useMemo(() => {
        return currentUser?.store_id ? { store_id: Number(currentUser.store_id) } : {}
    }, [currentUser])
    const resolvedFilter = useMemo(() => {
        return haveFilters ? filters.filter(filter => filter.type === "list") : []
    }, [haveFilters])
    const { filter, setFilter } = useFilter(`${props.type}_${settings.object}`, initialFilterValues)
    const isStoreSelected = Boolean(filter.store_id)


    /*
    --- Время 
    */
    const time = moment().format("HH:mm")
    const day = moment().format("dddd").slice(0, 1).toUpperCase() + moment().format("dddd").slice(1)
    const date = moment().format("DD MMM YYYY")


    /*
    --- Очередь из талонов на озвучку, данные по озвучиваемому талону
    */
    const [speakQueue, setSpeakQueue] = useState<Array<ModuleQueueTalonType>>([])
    const [talonData, setTalonData] = useState<ModuleQueueTalonType | null>(null)
    const [isAnnounceTime, setIsAnnounceTime] = useState(false)
    const showAnnouncementBlock = talonData && speakQueue.length


    /*
    --- Запрос на талоны, формирование очереди на озвучку из неозвученных талонов (если такие талоны уже не находится в очереди)
    */
    const { data, isFetching } = useQueue(object, filter)

    useEffect(() => {
        if (Array.isArray(data) && !isFetching) {
            setSpeakQueue(prev => {
                const alertsForSpeak = data.filter(alert => !alert.is_alert && !prev.find(alertFromQueue => alert.id === alertFromQueue.id))
                return alertsForSpeak.length ? prev.concat(alertsForSpeak) : prev
            })
        }
    }, [data, isFetching])


    /*
    --- Функция для воспроизведения озвучки, запуск озвучки при появлении талона и отсутствии озвучания другого талона
    */
    const speak = useCallback(async (talon: ModuleQueueTalonType) => {
        const sound = new Audio(getApiUrl() + talon.voice/* "https://zvukogram.com/mp3/p2/1465/signal-v-aeroportu-vosproizvedenie-vpered-i-nazad-34094.mp3" */)
        sound.addEventListener("loadedmetadata", () => {
            setIsAnnounceTime(true)
            sound.play()
            setTalonData(talon)
            if (!talon.is_alert) {
                api("visits", "update", { id: talon.id, is_alert: true })
            }
            setTimeout(() => {
                setSpeakQueue(prev => prev.filter((talonFromQueue, index) => index !== 0))
                setIsAnnounceTime(false)
            }, Math.floor(sound.duration * 1000))
        })
    }, []);

    useEffect(() => {
        if (speakQueue.length && !isAnnounceTime) {
            const talon = speakQueue[0]
            speak(talon)
        }
    }, [speakQueue, isAnnounceTime])


    return <>
        <ComponentButton
            className="moduleQueue_fullscreenButton"
            type="custom"
            settings={{ title: intl.formatMessage({ id: "QUEUE.FULLSCREEN_BUTTON" }), icon: "", background: "dark" }}
            customHandler={handleFullscreenButtonClick}
        />
        <div ref={moduleRef} className="moduleQueue">
            <div className="moduleQueue_header">
                <Filters filters={resolvedFilter as Array<ComponentFilterListType>} initialValues={filter} handleChange={setFilter} />
                <div className="moduleQueue_dateContainer">
                    <div className="moduleQueue_time">{time}</div>
                    <div className="moduleQueue_date">{day}<br />{date}</div>
                </div>

            </div>
            <div className="moduleQueue_talonsList">
                <div className="moduleQueue_talonsHeader">
                    <div className="moduleQueue_talon">Талон</div>
                    <div className="moduleQueue_direction" />
                    <div className="moduleQueue_cabinet">Кабинет</div>
                    <div className={`moduleQueue_detail${showAnnouncementBlock ? " hide" : ""}`}>Врач</div>
                </div>
                {!isStoreSelected ? <div className="moduleQueue_notice">{intl.formatMessage({id: "QUEUE.NOTICE"})}</div> : null}
                {data?.map(talon => <ModuleQueueTalon key={talon.id} {...talon} />)}
                <div className={`moduleQueue_announce${showAnnouncementBlock ? " active" : ""}`}>
                    <div>Пациент</div>
                    <div className="moduleQueue_announceText">{talonData?.talon}</div>
                    <div >пройдите в</div>
                    <div className="moduleQueue_announceText">Кабинет {talonData?.cabinet}</div>
                </div>
            </div>
        </div>
    </>
}

export default ModuleQueue