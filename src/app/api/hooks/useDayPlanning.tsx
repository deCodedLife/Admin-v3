import { useQuery } from "react-query"
import api from ".."
import { ApiResponseType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"
import { ModuleDayPlanningRowType } from "../../types/modules"




const useDayPlanning = (requestData: Object) => {

    const fetchKey = ["visits-day_planning", requestData]
    
    const fetchFunction = () => api("visits", "day_planning", requestData)
   
    const hookConfiguration = {
        retry: false,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        select: (data: ApiResponseType<Array<ModuleDayPlanningRowType>>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useDayPlanning