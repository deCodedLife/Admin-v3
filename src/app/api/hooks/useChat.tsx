import { useQuery } from "react-query"
import api from ".."
import { TApiResponse } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"


const useChat = <dataType = Array<any>>(object: string, requestData: any, enabled = true) => {

    const fetchKey = [object, requestData]

    const fetchFunction = () => api<dataType>(object, "get", requestData)

    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        enabled,
        keepPreviousData: true,
        select: (data: TApiResponse<dataType>) => data.data,
        onError: (error: any) => getErrorToast(error.message),
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useChat