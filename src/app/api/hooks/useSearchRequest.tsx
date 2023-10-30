import { useQuery } from "react-query"
import api from ".."
import { ApiResponseType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"
import { useDebounce } from "../../../_metronic/helpers"

const useSearchRequest = (props: {object: string, context: string, value: string, enabled: boolean, delay?: number}) => {
    const {object, context, value, enabled, delay = 500} = props

    const debouncedValue = useDebounce(value, delay)

    const isRequestEnabled = Boolean(enabled && debouncedValue?.length)
    const fetchKey = [`${context}-search`, object, debouncedValue]
    const fetchFunction = () => api<Array<any>>(object, "search", { context: { block: context }, search: debouncedValue })
    
    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isRequestEnabled,
        select: (data: ApiResponseType<Array<any>>) => {
            return data
        },
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useSearchRequest