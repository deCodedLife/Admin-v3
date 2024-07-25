import { useQuery } from "react-query"
import api from ".."
import { TApiResponse } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"

const useListData = (object: string, filter: any, enabled = true) => {
    const fetchKey = ["list", object, filter]


    const hookConfiguration = {
        enabled,
        retry: false,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        select: (data: TApiResponse<Array<{ [key: string]: any }>>) => {
            return data
        },
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading,
        isFetching,
        isRefetching,
        error,
        data,
        refetch
    } = useQuery(fetchKey, ({ signal }) => api<Array<{ [key: string]: any }>>(object, "get", filter, { signal }), hookConfiguration)
    return { isLoading, isFetching, isRefetching, error, data, refetch }
}

export default useListData