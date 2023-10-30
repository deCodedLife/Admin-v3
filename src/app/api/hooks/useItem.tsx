import { useQuery } from "react-query"
import api from ".."
import { ApiResponseType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"


const useItem = <dataType = Array<any>>(object: string, requestData: any, enabled = true) => {

    const fetchKey = [object, requestData]

    const fetchFunction = () => api<dataType>(object, "get", requestData)

    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        enabled,
        select: (data: ApiResponseType<dataType>) => data.data,
        onError: (error: any) => getErrorToast(error.message),
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useItem