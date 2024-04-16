import { useMemo } from "react"
import { useQuery } from "react-query"
import { useLocation } from "react-router-dom"
import api from ".."
import { TApiResponse } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"


const useDocument = () => {
    const { pathname } = useLocation()
    const pathAsArray = pathname.split("/")
    const id = useMemo(() => {
        const potentialId = Number(pathAsArray[pathAsArray.length - 1])
        return Number.isInteger(potentialId) ? potentialId : null
    }, [pathAsArray])
    const fetchKey = ["documents", id]
    const fetchFunction = () => api<Array<{
        title: string,
        structure: Array<{
            block_position: number | null,
            block_type: string,
            settings: {
                document_body: string
            }
        }>,
        type_id: { title: string, value: number },
        object?: string
    }>>("documents", "get", { id })
    const enabled = Boolean(id)
    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        enabled,
        select: (data: TApiResponse<Array<{
            title: string,
            structure?: Array<{
                block_position: number | null,
                block_type: string,
                settings: {
                    document_body: string
                }
            }>,
            type_id: { title: string, value: number } | null,
            object?: string
        }>>) => data.data[0],
        onError: (error: any) => getErrorToast(error.message),
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useDocument