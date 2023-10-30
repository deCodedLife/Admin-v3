import { useQuery } from "react-query"
import api from ".."
import { ApiResponseType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"


const useRequest = <dataType = any>(object: string, command: string, requestData: any, enabled = true) => {

    const fetchKey = [object, command, requestData]

    const fetchFunction = () => api<dataType>(object, command, requestData)

    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        enabled,
        select: (data: ApiResponseType<dataType>) => data.data,
        /* временно убрать тосты, т.к. запрос на получение полей редактирования (List) работает только у RitZip */
        onError: (error: any) => {}/* getErrorToast(error.message) */,
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useRequest