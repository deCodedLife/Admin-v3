import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import setDrawerIndex from '../helpers/setDrawerIndex'


type TComponentDrawer = {
    children: React.ReactNode,
    direction?: "top" | "right" | "bottom" | "left",
    show: boolean,
    setShow: (state: boolean) => void,
    onEntered?: () => void,
    onExited?: () => void
}

const ComponentDrawer: React.FC<TComponentDrawer> = ({ children, direction = "right", show, setShow, onEntered, onExited }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [showDrawer, setShowDrawer] = useState(false)
    const [wrapperClassName, setWrapperClassName] = useState("componentDrawer_wrapper")
    const [className, setClassName] = useState(`componentDrawer ${direction}`)

    useEffect(() => {
        if (show) {
            setShowDrawer(true)
            setTimeout(() => {
                setWrapperClassName("componentDrawer_wrapper active")
                setClassName(`componentDrawer ${direction} active`)
            }, 300)
            onEntered?.()
            return () => {
                setWrapperClassName("componentDrawer_wrapper")
                setClassName(`componentDrawer ${direction}`)
                setTimeout(() => {
                    setShowDrawer(false)
                }, 300)
                onExited?.()
            }
        }
    }, [show])

    const handleCloseClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setShow(false)
        }
    }

    if (!showDrawer) {
        return null
    }

    return createPortal(<div ref={ref} style={{
        zIndex: setDrawerIndex(ref.current)
    }} className={wrapperClassName} onClick={handleCloseClick}>
        <div className={className}>
            <button type="button" className="btn-close" onClick={() => setShow(false)} />
            {children}
        </div>
    </div>, document.body)
}

export default ComponentDrawer