/* eslint-disable jsx-a11y/anchor-is-valid */
import moment from 'moment'
import React, { useCallback, useRef, useState } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../helpers'
import { useIntl } from 'react-intl'
import { Modal } from 'react-bootstrap'
import { TNotificationItem, TNotifications } from '../../../../app/types/global'
import ComponentTooltip from '../../../../app/constructor/components/ComponentTooltip'
import setModalIndex from '../../../../app/constructor/helpers/setModalIndex'


const NotificationItem: React.FC<TNotificationItem> = ({ id, title, description, status, created_at, href, handleNotificationClick, handleReadNotification }) => {
  const intl = useIntl()
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest(".notificationItem_button")) {
      return
    } else if (href) {
      linkRef.current?.click()
      handleReadNotification(id)
    } else {
      handleNotificationClick(id, title, description)
    }
  }
  return <div className="notificationItem" onClick={handleClick}>
    <div className="notificationItem_mainProperties">
      <span className={`notificationItem_status ${status}`} />
      <h5 className="notificationItem_title">{title}</h5>
      <span className="notificationItem_date">{moment(created_at).format("DD MMMM YY HH:mm")}</span>
      <ComponentTooltip title={intl.formatMessage({ id: "NOTIFICATIONS.READ_NOTIFICATION_BUTTON_TITLE" })}>
        <button
          type="button"
          className="notificationItem_button"
          onClick={() => handleReadNotification(id)}>
          <KTSVG path="/media/crm/icons/glasses.svg" />
        </button>
      </ComponentTooltip>
    </div>
    <div className="notificationItem_description">{description}</div>
    <a ref={linkRef} href={href} target='_blank' style={{ display: "none" }} onClick={event => {
      if (!href) {
        event.preventDefault()
      }
    }} />
  </div>
}


const HeaderNotificationsMenu: React.FC<TNotifications> = ({ notifications, handleReadNotification }) => {
  const intl = useIntl()
  const [showModal, setShowModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<{ id: number, title: string, description: string } | null>(null)

  const handleNotificationClick = useCallback((id: number, title: string, description: string) => {
    setSelectedNotification({ id, title, description })
    setShowModal(true)
  }, [])

  const handleCloseModal = () => {
    setShowModal(false)
    if (selectedNotification) {
      handleReadNotification(selectedNotification.id)
    }
    setTimeout(() => setSelectedNotification(null), 300)
  }

  const haveNotifications = Array.isArray(notifications) && notifications.length

  return <div
    className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px'
    data-kt-menu='true'
  >
    <div className="notificationTitleContainer">
      <h3 className='text-white fw-bold px-9 mt-10 mb-6'>
        {intl.formatMessage({ id: "NOTIFICATIONS.TITLE" })}
      </h3>
    </div>

    <div className='scroll-y mh-325px my-5 px-8'>
      {haveNotifications ? notifications?.map((notification) =>
        <NotificationItem key={notification.id} {...notification} handleNotificationClick={handleNotificationClick} handleReadNotification={handleReadNotification} />) :
        <div className="notificationItem empty"> {intl.formatMessage({ id: "NOTIFICATIONS.EMPTY_LIST" })}</div>}
    </div>
    <Modal centered show={showModal && Boolean(selectedNotification)} onHide={handleCloseModal} onEntering={setModalIndex}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedNotification?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{selectedNotification?.description}</p>
      </Modal.Body>
    </Modal>
  </div>
}

export { HeaderNotificationsMenu }



