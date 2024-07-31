import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const useModalSettings = (page?: string | null) => {
    const [urlPattern, setUrlPattern] = useState<string | null>(null)
    const navigate = useNavigate()
    const location = useLocation()


    const handleEntered = () => {
        const search = location.search
        const regexToCheckUrl = new RegExp(`[\\?|\\&]modal=${page}`, "g")
        const pathInUrl = search.match(regexToCheckUrl)?.[0]
        if (pathInUrl) {
            return setUrlPattern(pathInUrl)
        } else {
            const resolvedPath = search ? search + `&modal=${page}` : `?modal=${page}`
            navigate(resolvedPath)
            return setUrlPattern(search ? `&modal=${page}` : `?modal=${page}`)
        }
    }

    const handleExited = () => {
        const regex = new RegExp(`\\${urlPattern}.*`)
        const resolvedPath = location.pathname + location.search.replace(regex, "")
        navigate(resolvedPath)
    }

    return { handleEntered, handleExited }
}

export default useModalSettings