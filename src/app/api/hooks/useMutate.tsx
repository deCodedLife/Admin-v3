import { useMutation } from "react-query"
import api from ".."
import { getErrorToast, getSuccessToast } from "../../constructor/helpers/toasts"


const useMutate = <item = any>(object: string, command: string, showToasts = {success: true, error: true}) => {
    const { mutate, mutateAsync, isSuccess, isLoading, data } = useMutation<any, any, item>(item => api(object, command, item), {
        onError: (error: any) => {
            if (showToasts.error) {
                getErrorToast(error.message)
            }   
        },
        onSuccess: () => {
            if (showToasts.success) {
                getSuccessToast()
            }
        }
    })
    return { mutate, mutateAsync, isSuccess, isLoading, data }
}

export default useMutate