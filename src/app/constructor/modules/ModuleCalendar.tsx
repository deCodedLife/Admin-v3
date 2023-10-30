import moment from "moment"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ModuleCalendarType } from "../../types/modules"
import { Calendar, SlotInfo, View, momentLocalizer } from 'react-big-calendar'
import useCalendar from "../../api/hooks/useCalendar"
import ComponentDashboard from "../components/ComponentDashboard"
import ComponentButton from "../components/ComponentButton"
import { Modal } from "react-bootstrap"
import useMutate from "../../api/hooks/useMutate"
import { useIntl } from "react-intl"
import { ModuleContext } from "./helpers/useModuleContent"
import ComponentModal from "../components/ComponentModal"
import ComponentFilters from "../components/ComponentFilters"
import { useFilter } from "./helpers"
import setModalIndex from "../helpers/setModalIndex"


const ModuleCalendar: React.FC<ModuleCalendarType> = (props) => {
  const localizer = momentLocalizer(moment)
  const intl = useIntl()
  const { settings, components } = props
  const { object, filters: initialFilters, events: { add, update }, context: page_context } = settings

  const haveFilter = Boolean(components?.filters)
  const haveButtons = Boolean(props.components?.buttons)

  const resolvedInitialFilterValues = Object.assign({}, {
    event_from: moment().startOf("month").format("YYYY-MM-DD 00:00:00"),
    event_to: moment().endOf("month").format("YYYY-MM-DD 23:59:59")
  }, initialFilters)


  const [selectedSlots, setSelectedSlots] = useState<{ start_from: string, start_to: string, event_from: string, event_to: string } | null>(null)
  const handleCloseDayEventModal = useCallback((value: any) => setSelectedSlots(null), [])
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const { filter, isInitials, setFilter, resetFilter } = useFilter(`${props.type}_${object}`, resolvedInitialFilterValues)
  const { data, refetch } = useCalendar(object, filter)
  const { mutate, isSuccess } = useMutate<{ id: number }>(object, "remove", { success: false, error: true })
  const [date, setDate] = useState<Date>(new Date(moment(filter.event_from).format()))
  const [view, setView] = useState<View>("month")


  useEffect(() => {
    if (isSuccess) {
      setSelectedEventId(null)
      refetch()
    }
  }, [isSuccess])

  const handleDeleteEvent = () => selectedEventId ? mutate({ id: selectedEventId }) : null

  const handleClearCalendar = () => {
    if (Array.isArray(events)) {
      events.forEach(event => mutate({ id: Number(event.id) }))
    }
  }

  const handleNavigateChange = (date: Date, view: View, action: any) => {
    setDate(date)
    setFilter((filterValues: { [key: string]: any }) => {
      return {
        ...filterValues,
        event_from: moment(date).startOf("month").format("YYYY-MM-DD 00:00:00"),
        event_to: moment(date).endOf("month").format("YYYY-MM-DD 23:59:59")
      }
    })
  }

  const handleRangeChange = (range: Date[] | { start: Date; end: Date }, view?: View) => {
    setView(view ?? "month")
  }

  const handleSlotSelect = (slot: SlotInfo) => setSelectedSlots(prev => {
    return view === "month" ? {
      start_from: moment(slot.start).format("YYYY-MM-DD"),
      start_to: moment(slot.end).subtract(1, "day").format("YYYY-MM-DD"),
      event_from: "00:00",
      event_to: "23:59",
    } :
      {
        start_from: moment(slot.start).format("YYYY-MM-DD"),
        start_to: moment(slot.end).format("YYYY-MM-DD"),
        event_from: moment(slot.start).format("HH:mm"),
        event_to: moment(slot.end).format("HH:mm"),
      }
  })

  const events = useMemo(() => {
    if (data) {
      return Object.entries<Array<{ id: string, title: string, from: string, to: string, background: string }>>(data).reduce((acc, value) => {
        const [date, events] = value
        const currentFormatEvents = events.map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(`${date} ${event.from}`),
          end: new Date(`${date} ${event.to}`),
          background: event.background
        }))
        return acc.concat(currentFormatEvents)
      }, [] as Array<{ id: string, title: string, start: Date, end: Date }>)
    } else {
      return []
    }
  }, [data])

  const contextValue = useMemo(() => ({
    refresh: refetch
  }), [])

  return <>
    <ModuleContext.Provider value={contextValue}>
      <ComponentDashboard inverse>
        {haveButtons ? props.components.buttons.map(button => <ComponentButton key={button.settings.title} {...button} />) : null}
        <ComponentButton
          type="custom"
          settings={{ title: intl.formatMessage({ id: "CALENDAR.CLEAR_BUTTON" }), icon: "", background: "danger", attention_modal: true }}
          customHandler={handleClearCalendar} />
        {haveFilter ? <ComponentFilters
          type="dropdown"
          data={components.filters}
          filterValues={filter}
          isInitials={isInitials}
          handleChange={setFilter}
          handleReset={resetFilter}
        /> : null}
      </ComponentDashboard>
      <div className="moduleCalendar_container" style={{ height: "700px" }}>
        <Calendar
          className="moduleCalendar"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          messages={{
            today: intl.formatMessage({ id: "CALENDAR.TODAY_BUTTON" }),
            previous: intl.formatMessage({ id: "BUTTON.PREVIOUS" }),
            next: intl.formatMessage({ id: "BUTTON.NEXT" }),
            month: intl.formatMessage({ id: "CALENDAR.MONTH_CAPTION" }),
            week: intl.formatMessage({ id: "CALENDAR.WEEK_CAPTION" }),
            day: intl.formatMessage({ id: "CALENDAR.DAY_CAPTION" }),
            date: intl.formatMessage({ id: "CALENDAR.DATE_CAPTION" }),
            time: intl.formatMessage({ id: "CALENDAR.TIME_CAPTION" }),
            agenda: intl.formatMessage({ id: "CALENDAR.AGENDA_CAPTION" }),
            event: intl.formatMessage({ id: "CALENDAR.EVENT_CAPTION" }),
            showMore: (total) => `Еще ${total}`
          }}
          date={date}
          onNavigate={handleNavigateChange}
          onRangeChange={handleRangeChange}
          onSelectEvent={event => setSelectedEventId(Number(event.id))}
          onSelectSlot={handleSlotSelect}
          selectable={Boolean(add)}
          eventPropGetter={(event) => {
            /* @ts-ignore */
            return { className: event.background }
          }}
        />
      </div>
      <ComponentModal
        page={add}
        page_context={page_context}
        show={selectedSlots}
        size="lg"
        setShow={handleCloseDayEventModal}
        refresh={refetch}
      />

      <ComponentModal
        page={selectedEventId ? update + `/${selectedEventId}` : undefined}
        size="lg"
        page_context={page_context}
        show={showEditModal && selectedEventId ? { id: selectedEventId } : false}
        setShow={() => setShowEditModal(false)}
        refresh={() => {
          setSelectedEventId(null)
          refetch()
        }} />
      <Modal size="sm" show={Boolean(selectedEventId)} onHide={() => setSelectedEventId(null)} centered onEntering={setModalIndex}>
        <Modal.Body>
          <div className="moduleCalendar_actionsModalContainer">
            <ComponentButton
              type="custom"
              settings={{ title: intl.formatMessage({ id: "BUTTON.EDIT" }), icon: "", background: "dark" }}
              customHandler={() => setShowEditModal(true)}
            />
            <ComponentButton
              type="custom"
              settings={{ title: intl.formatMessage({ id: "BUTTON.DELETE" }), icon: "", background: "danger", attention_modal: true }}
              customHandler={handleDeleteEvent}
            />
          </div>
        </Modal.Body>
      </Modal>
    </ModuleContext.Provider>

  </>
}

export default ModuleCalendar