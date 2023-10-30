import { useQuery } from "react-query"
import api from ".."
import { ApiResponseType, ApiSetupType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"


const useSetup = () => {

    const fetchKey = ["setup-request"]

    const fetchFunction = () => api<ApiSetupType>("admin", "get-system-components", {})

    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        select: (data: ApiResponseType<ApiSetupType>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useSetup