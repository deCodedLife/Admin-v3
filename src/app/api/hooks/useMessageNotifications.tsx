import { useQuery } from "react-query"
import api from ".."
import { ApiResponseType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"
import { NotificationItemType } from "../../types/global"
import { useAuth } from "../../modules/auth"
import { TMessage } from "../../constructor/modules/ModuleDIalog"


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
        select: (data: ApiResponseType<Array<TMessage>>) => data.data,
        onError: (error: any) => {} /* getErrorToast(error.message) */,
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useMessageNotifications