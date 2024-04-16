import { useQuery } from "react-query"
import api from ".."
import { TApiResponse } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"
import { useAuth } from "../../modules/auth"
import { TSalary } from "../../constructor/modules/ModuleSalaryWidgets/_types"


const useSalary = () => {
    const { currentUser } = useAuth()
    const userId = currentUser?.id
    const fetchKey = ["users", "kpi", { id: userId }]

    const fetchFunction = () => api<Array<TSalary>>("users", "kpi", { id: userId })

    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: Boolean(userId),
        refetchInterval: 4000,
        select: (data: TApiResponse<Array<TSalary>>) => data.data,
        onError: (error: any) => {} /* getErrorToast(error.message) */,
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useSalary