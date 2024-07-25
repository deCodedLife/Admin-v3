import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const useModalSettings = (page?: string | null) => {
    const [urlPattern, setUrlPattern] = useState<string | null>(null)
    const navigate = useNavigate()
    const location = useLocation()


    const handleEntered = () => {
        const resolvedPath = location.search ? location.search + `&modal=${page}` : `?modal=${page}`
        navigate(resolvedPath)
        setUrlPattern(location.search ? `&modal=${page}` : `?modal=${page}`)
    }

    const handleExited = () => {
        const regex = new RegExp(`\\${urlPattern}.*`)
        const resolvedPath = location.pathname + location.search.replace(regex, "")
        navigate(resolvedPath)
    }

    return { handleEntered, handleExited }
}

export default useModalSettings