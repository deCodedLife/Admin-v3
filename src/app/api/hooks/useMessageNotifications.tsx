import { useQuery } from "react-query"
import api from ".."
import { TApiResponse } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"
import { useAuth } from "../../modules/auth"
import { TMessage } from "../../constructor/modules/ModuleDialog/_types"


const useMessageNotifications = () => {
    const { currentUser } = useAuth()
    const userId = currentUser?.id
    const fetchKey = ["personMessages", "get-notifications", { user_id: userId }]

    const fetchFunction = () => api<Array<TMessage>>("personMessages", "get-notifications", { user_id: userId })

    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: Boolean(userId),
        refetchInterval: 5000,
        select: (data: TApiResponse<Array<TMessage>>) => data.data,
        onError: (error: any) => {} /* getErrorToast(error.message) */,
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useMessageNotifications