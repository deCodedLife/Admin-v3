import { useQuery } from "react-query"
import api from ".."
import { TApiResponse, TApiSchedule } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"




const useSchedule = (object: string, filters = {}) => {

    const fetchKey = [`${object}-schedule`, filters]
    
    const fetchFunction = () => api(object, "schedule", filters)
   
    const hookConfiguration = {
        retry: false,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        select: (data: TApiResponse<TApiSchedule>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useSchedule