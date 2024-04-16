import { useQuery } from "react-query"
import api from ".."
import { TApiResponse } from "../../types/api"
import { TGlobalSearchSection } from "../../types/global"
import { getErrorToast } from "../../constructor/helpers/toasts"

const useGlobalSerach = (search: string) => {
    const fetchKey = ["global-search", search]

    const fetchFunction = () => api<Array<TGlobalSearchSection>>("admin", "global-search", { search })
    const isRequestEnabled = search.length > 3 || search.length === 0
    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isRequestEnabled,
        keepPreviousData: true,
        select: (data: TApiResponse<Array<TGlobalSearchSection>>) => {
            return data.data
        },
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading, error, data, refetch, isFetching } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isFetching, error, data, refetch }
}

export default useGlobalSerach