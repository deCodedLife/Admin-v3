export type TComponentDrawer = {
    children: React.ReactNode,
    direction?: "top" | "right" | "bottom" | "left",
    show: boolean,
    setShow: (state: boolean) => void,
    onEntered?: () => void,
    onExited?: () => void
}