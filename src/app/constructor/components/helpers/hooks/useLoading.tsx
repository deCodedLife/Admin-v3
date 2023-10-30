import { useEffect, useState } from "react"


const useLoading = (loading: boolean, delay = 300) => {
    const [isTimeIsOut, setIsTimeIsOut] = useState(!loading)
    useEffect(() => {
        if (loading) {
            setIsTimeIsOut(false)
            setTimeout(() => {
                setIsTimeIsOut(true)
            }, delay)
        }
    }, [loading])
    return isTimeIsOut && !loading
}
export default useLoading