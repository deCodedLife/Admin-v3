import { useQuery } from "react-query"
import api from ".."
import { ApiResponseType, ApiWidgetType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"



const useWidget = (command: string, filter: any) => {
    const fetchKey = ["analytic_widgets", command, filter]
    
    const fetchFunction = () => api<ApiWidgetType>("analytic_widgets", command, filter)
   
    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        select: (data: ApiResponseType<ApiWidgetType>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading, isRefetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isRefetching, error, data, refetch }
}

export default useWidget