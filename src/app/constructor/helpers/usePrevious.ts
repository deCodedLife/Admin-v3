import { useEffect, useRef } from "react"

const usePrevious = <T = any>(value: T) => {
    const previousValueRef = useRef<T | null>(null)

    useEffect(() => {
        previousValueRef.current = value
    }, [value])

    return previousValueRef.current
}

export default usePrevious