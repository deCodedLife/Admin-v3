import { useQuery } from "react-query"
import api from ".."
import { ApiPageType, ApiResponseType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"


const useScheduleForm = (requestObject: string, cell: {type: "available" | "busy", date: string, time: string, event: any, initials: {[key: string]: any}} | null) => {
    const enabled = Boolean(cell)
    const fetchKey = ["scheduleForm", cell]
    const requestPath = cell ? cell.type === "busy" ? `${requestObject}/update/${cell.event?.id}` : `${requestObject}/add` : ""
    const resolvedRequestData = cell?.initials?.user_id ? {page: requestPath, context: {user_id: cell.initials.user_id}} : { page: requestPath }
    const fetchFunction = () => api<ApiPageType>("pages", "get", resolvedRequestData)
   
    const hookConfiguration = {
        retry: false,
        refetchOnWindowFocus: false,
        enabled,
        select: (data: ApiResponseType<ApiPageType>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading, isFetching, error, data, refetch } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data, refetch }
}

export default useScheduleForm