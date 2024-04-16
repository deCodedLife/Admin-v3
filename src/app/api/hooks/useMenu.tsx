import { useQuery } from "react-query"
import api from ".."
import { TApiMenu, TApiResponse } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"


const useMenu = () => {

    const fetchKey = ["menu"]
    
    const fetchFunction = () => api<TApiMenu>("menu", "get")
   
    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        select: (data: TApiResponse<TApiMenu>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading, error, data } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, error, data }
}

export default useMenu