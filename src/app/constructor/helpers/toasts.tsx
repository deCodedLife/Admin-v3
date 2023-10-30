import toast from "react-hot-toast"

export const getSuccessToast = (message?: string) => toast.success(message ?? "Успешно!", {
    style: {
        border: "1px solid #50cd89",
        backgroundColor: "#50cd89",
        color: "#fff",
        padding: '16px',
        fontSize: "1rem",
    },
    iconTheme: {
        primary: "#fff",
        secondary: "#50cd89"
    }
})

export const getErrorToast = (message?: string) => toast.error(message ?? "При выполнении запроса произошла ошибка. Пожалуйста, попробуйте еще раз.", {
    style: {
        border: "1px solid #f1416c",
        backgroundColor: "#f1416c",
        color: "#fff",
        padding: '16px',
        fontSize: "1rem",
        textAlign: "center"
    },
    iconTheme: {
        primary: "#fff",
        secondary: "#f1416c"
    }
})

