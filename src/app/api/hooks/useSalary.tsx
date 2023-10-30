import { useQuery } from "react-query"
import api from ".."
import { ApiResponseType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"
import { SalaryType } from "../../types/global"
import { useAuth } from "../../modules/auth"


const useSalary = () => {
    const { currentUser } = useAuth()
    const userId = currentUser?.id
    const fetchKey = ["users", "kpi", { id: userId }]

    const fetchFunction = () => api<Array<SalaryType>>("users", "kpi", { id: userId })

    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: Boolean(userId),
        refetchInterval: 4000,
        select: (data: ApiResponseType<Array<SalaryType>>) => data.data,
        onError: (error: any) => {} /* getErrorToast(error.message) */,
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useSalary