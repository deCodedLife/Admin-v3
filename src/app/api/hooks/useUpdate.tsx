import { useEffect } from "react"
import { useQuery } from "react-query"
import api from ".."
import { useAuth } from "../../modules/auth"
import { ApiResponseType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"


const useUpdate = (updateFunctions: Array<{ active: boolean, update: () => void }>, table_name?: string, refetchInterval = 5000) => {
    const { currentUser } = useAuth()
    const userId = Number(currentUser?.id)

    const fetchKey = ["events", { table_name, role_id: userId }]

    const fetchFunction = () => api<string | number>("events", "get-last-id", { table_name, user_id: userId })
    const isEnabled = Boolean(userId) && Boolean(table_name)
    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval,
        enabled: isEnabled,
        select: (data: ApiResponseType<string | number>) => data.data,
        onError: (error: any) => getErrorToast(error.message),

    }
    const { isLoading, error, data: updateLog } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    useEffect(() => {
        if (updateLog) {
            updateFunctions.forEach(func => {
                if (func.active) {
                    func.update()
                }
            })
        }
    }, [updateLog])
}

export default useUpdate