import { useQuery } from "react-query"
import api from ".."
import { ApiPageType, ApiResponseType } from "../../types/api"
import { getErrorToast } from "../../constructor/helpers/toasts"


const useScheduleForm = (requestObject: string, cell: {type: "available" | "busy", date: string, time: string, event: any} | null) => {
    const enabled = Boolean(cell)
    const fetchKey = ["scheduleForm", cell]
    const requestPath = cell ? cell.type === "busy" ? `${requestObject}/update/${cell.event?.id}` : `${requestObject}/add` : ""
    const fetchFunction = () => api<ApiPageType>("pages", "get", { page: requestPath })
   
    const hookConfiguration = {
        retry: false,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        enabled,
        select: (data: ApiResponseType<ApiPageType>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    }
    const { isLoading, isFetching, error, data } = useQuery(fetchKey, fetchFunction, hookConfiguration)
    return { isLoading, isFetching, error, data }
}

export default useScheduleForm