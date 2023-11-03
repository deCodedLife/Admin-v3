/*
--- Функция для динамичкской подстановки индекса текущего (последнее из списка модальных окон - текущее) модального окна 
PS. Не отключать backdrop'ы у модалок.
PSS. функция ставится в onEntering событие
*/
const setModalIndex = () => {
    const drawersList = document.body.getElementsByClassName("componentDrawer_wrapper")
    const backdropsList = document.body.getElementsByClassName("modal-backdrop show")
    const modalsList = document.body.getElementsByClassName("modal show")
    const currentBackdrop = backdropsList[backdropsList.length - 1]
    const currentModal = modalsList[modalsList.length - 1]
    const currentBackdropZindex = 1050 + (backdropsList.length + drawersList.length - 1) * 5
    const currentModalZIndex = currentBackdropZindex + 3
    currentBackdrop.setAttribute("style", `z-index: ${currentBackdropZindex}`)
    currentModal.setAttribute("style", `display: block; z-index: ${currentModalZIndex}`)
}

export default setModalIndex