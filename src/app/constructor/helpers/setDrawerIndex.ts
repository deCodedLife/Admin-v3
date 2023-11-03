/*
--- Функция для динамичкской подстановки индекса текущего (последнее из списка модальных окон - текущее) модального окна 
*/
const setDrawerIndex = (currentDrawer: HTMLDivElement | null) => {
    const modalsList = document.body.getElementsByClassName("modal show")
    const drawersList = document.body.getElementsByClassName("componentDrawer_wrapper")
    const currentElementsLength = modalsList.length + drawersList.length
    return 1050 + (currentElementsLength - 1) * 5 + 3
}

export default setDrawerIndex