import { useMutation } from "react-query"
import { uploadFiles } from ".."
import { getErrorToast, getSuccessToast } from "../../constructor/helpers/toasts"


const useMutateWithFiles = <item = any>(object: string, command: string, showToasts = true) => {
    const { mutate, isSuccess, isLoading, data } = useMutation<any, any, item>(item => uploadFiles(object, command, item), {
        onError: (error: any) => {
            if (showToasts) {
                getErrorToast(error.message)
            }
        },
        onSuccess: () => {
            if (showToasts) {
                getSuccessToast()
            }
        }
    })
    return { mutate, isSuccess, isLoading, data }
}

export default useMutateWithFiles