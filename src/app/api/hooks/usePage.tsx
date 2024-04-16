import { useQuery } from "react-query"
import { useLocation } from "react-router-dom"
import api from ".."
import { TApiPage, TApiResponse } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"


const usePage = () => {
    // из url получаем значение page
    const { pathname } = useLocation()
    const resolvedPath = pathname.slice(1)

    const fetchKey = ["page", { page: resolvedPath }]

    const fetchFunction = () => api<TApiPage>("pages", "get", { page: resolvedPath })

    const hookConfiguration = {
        retry: false,
    /*     keepPreviousData: true, */
        refetchOnWindowFocus: false,
        select: (data: TApiResponse<TApiPage>) => data.data,
        onError: (error: {message: string}) => getErrorToast(error.message)
    }
    const { isLoading, isFetching, error, data } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data }
}

export default usePage