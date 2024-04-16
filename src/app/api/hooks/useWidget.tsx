import { useQuery } from "react-query"
import api from ".."
import { ApiResponseType, TApiWidget } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"



const useWidget = (command: string, filter: any) => {
    const fetchKey = ["analytic_widgets", command, filter]
    
    const fetchFunction = () => api<TApiWidget>("analytic_widgets", command, filter)
   
    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        select: (data: ApiResponseType<TApiWidget>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading, isRefetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isRefetching, error, data, refetch }
}

export default useWidget