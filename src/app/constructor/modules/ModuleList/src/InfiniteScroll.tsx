import { useEffect, useRef, useState } from "react"
import { TModuleListInfiniteScroll } from "../_types"

export const InfiniteScroll: React.FC<TModuleListInfiniteScroll> = props => {
    const { currentRowsCount = 0, rowsCount = 0, hasNextPage, isFetching, fetch } = props
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting)
        })
        observer.observe(ref?.current as Element)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (isVisible && hasNextPage && !isFetching) {
            fetch()
        }
    }, [isVisible])

    return <div ref={ref} className="infiniteScroll">Показано {currentRowsCount} строк из {rowsCount}</div>
}