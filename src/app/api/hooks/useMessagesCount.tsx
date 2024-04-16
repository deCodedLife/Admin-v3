import { useQuery } from "react-query"
import api from ".."
import { TApiResponse } from "../../types/api"


const useMessagesCount = () => {

    const fetchKey = ["personMessages", "get-unread-count"]

    const fetchFunction = () => api("personMessages", "get-unread-count")

    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: 5000,
        select: (data: TApiResponse<any>) => data.data,
        onError: (error: any) => {} /* getErrorToast(error.message) */,
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useMessagesCount