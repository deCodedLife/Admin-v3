import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import setDrawerIndex from '../../helpers/setDrawerIndex'
import { TComponentDrawer } from './_types'

const ComponentDrawer: React.FC<TComponentDrawer> = ({ children, direction = "right", show, setShow, onEntered, onExited }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [showDrawer, setShowDrawer] = useState(false)
    const [wrapperClassName, setWrapperClassName] = useState("componentDrawer_wrapper")
    const [className, setClassName] = useState(`componentDrawer ${direction}`)

    const handleEscClick = useCallback((event: KeyboardEvent) => {
        const currentBodyChildren = document.body.children
        const isDrawerInFocus = currentBodyChildren[currentBodyChildren.length - 1] === ref.current
        if (isDrawerInFocus && event.key === "Escape") {
            return setShow(false)
        }
    }, [])

    useEffect(() => {
        if (show) {
            document.body.setAttribute("style", "overflow: hidden; padding-right: 4px;")
            document.addEventListener("keydown", handleEscClick)
            setShowDrawer(true)
            setTimeout(() => {
                setWrapperClassName("componentDrawer_wrapper active")
                setClassName(`componentDrawer ${direction} active`)
            }, 300)
            onEntered?.()
            return () => {
                document.body.removeAttribute("style")
                document.removeEventListener("keydown", handleEscClick)
                setWrapperClassName("componentDrawer_wrapper")
                setClassName(`componentDrawer ${direction}`)
                setTimeout(() => {
                    setShowDrawer(false)
                }, 300)
                onExited?.()
            }
        }
    }, [show])

    const currentDrawerIndex = useMemo(() => {
        return showDrawer ? setDrawerIndex() : 0
    }, [showDrawer])

    const handleCloseClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setShow(false)
        }
    }

    if (!showDrawer) {
        return null
    }

    return createPortal(<div ref={ref} style={{
        zIndex: currentDrawerIndex
    }} className={wrapperClassName} onMouseDown={handleCloseClick}>
        <div className={className}>
            <button type="button" className="btn-close" onClick={() => setShow(false)} />
            {children}
        </div>
    </div>, document.body)
}

export default ComponentDrawer