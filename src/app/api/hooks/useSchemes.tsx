import { useQuery } from "react-query"
import api from ".."
import { ApiResponseType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"




const useSchemes = <dataType = any>(type = "main", scheme_type?: string, scheme_name?: string) => {

    const fetchKey = ["schemes", type, { scheme_type, scheme_name }]

    const fetchFunction = () => api("admin", "get-schemes", { scheme_type, scheme_name })
    
    const enabled = type === "main" || Boolean(scheme_name)

    const hookConfiguration = {
        retry: false,
        enabled,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        select: (data: ApiResponseType<dataType>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useSchemes