import { useQuery } from "react-query"
import api from ".."
import { TApiResponse } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"
import { TNotificationItem } from "../../types/global"
import { useAuth } from "../../modules/auth"


const useNotifications = () => {
    const { currentUser } = useAuth()
    const userId = currentUser?.id
    const fetchKey = ["notifications", "get", { user_id: userId }]

    const fetchFunction = () => api<Array<TNotificationItem>>("notifications", "get", { user_id: userId })

    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: Boolean(userId),
        refetchInterval: 4000,
        refetchIntervalInBackground: true,
        select: (data: TApiResponse<Array<TNotificationItem>>) => data.data,
        onError: (error: any) => {} /* getErrorToast(error.message) */,
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useNotifications