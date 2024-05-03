/*
--- Функция для динамичкской подстановки индекса текущего модального окна 
*/
const setDrawerIndex = () => {
    const modalsList = document.body.getElementsByClassName("modal show")
    const drawersList = document.body.getElementsByClassName("componentDrawer_wrapper")
    const currentElementsLength = modalsList.length + drawersList.length
    return 1050 + (currentElementsLength) * 5 + 3
}

export default setDrawerIndex