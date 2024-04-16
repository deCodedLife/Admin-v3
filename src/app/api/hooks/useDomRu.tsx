import { useEffect } from "react"
import { useQuery } from "react-query"
import api from ".."
import { useAuth } from "../../modules/auth"
import { TApiResponse } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"

type ApiDomRuResponseType = {type: "phone", value: string} | {type: "page", value: string, phone: string} | false
const useDomRu = () => {
    const { currentUser } = useAuth()
    const userId = Number(currentUser?.id)

    const fetchKey = ["dom_ru -> get_income_calls"]

    const fetchFunction = () => api<ApiDomRuResponseType>("dom_ru", "get_income_calls", { user_id: userId })
    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: 3000,
        select: (data: TApiResponse<ApiDomRuResponseType>) => data.data,
        onError: (error: any) => getErrorToast(error.message),

    }
    const { isLoading, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, error, data, refetch }
}

export default useDomRu