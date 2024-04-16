import { useQuery } from "react-query"
import api from ".."
import { TApiResponse } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"
import { TModuleQueueTalon } from "../../constructor/modules/ModuleQueue/_types"


const useQueue = (object: string, requestData: any) => {

    const fetchKey = [object, "get_queue", requestData]

    const fetchFunction = () => api<Array<TModuleQueueTalon>>(object, "get_queue", requestData)

    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: 2000,
        select: (data: TApiResponse<Array<TModuleQueueTalon>>) => data.data,
        onError: (error: any) => {} /* getErrorToast(error.message) */,
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useQueue