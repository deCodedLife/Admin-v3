import axios from "axios"
import { ApiResponseType } from "../types/api"
import { getErrorToast } from "../constructor/helpers/toasts"


export const getApiUrl = () => {
    /* 2 структуры ссылки: "поддомен.домен.регион" или "домен.регион" */
    const url = window.location.hostname.split(".")
    const currentDomain = url.length === 3 ? url[1] : url[0]
    const currentSubdomain = url.length === 3 ? url[0] : null
    let apiUrl = `https://${currentSubdomain ? `${currentSubdomain}.` : ""}`
    
    switch (currentDomain) {
        case "docacrm":
            apiUrl += "docacrm.com"
            break
        case "eatobox":
            apiUrl += "eatobox-api.ru"
            break
        case "ritzipcrm":
            apiUrl += "ritzipcrm-api.com"
            break
        case "adwanto":
            apiUrl += "adwanto-api.com"
            break
        case "animocrm":
            apiUrl += "animocrm.ru"
            break
        default:
            apiUrl = "https://demo.docacrm.com"
    }

    if (currentDomain === "mewbas" && currentSubdomain === "crm-admin") {

        apiUrl = "https://crm-api.mewbas.com"

    } else if (currentDomain === "docacrm" && currentSubdomain === "astragreenv3admin") {

        apiUrl = "https://astragreenv3.docacrm.com/"
        
    } else if (currentDomain === "docacrm" && currentSubdomain === "demo") {

        apiUrl = "https://domru.docacrm.com/"
        
    }

    return apiUrl
}


const instanse = axios.create({
    baseURL: getApiUrl(),
    headers: {
        "Content-Type": "application/json"
    }
})

const api = async <dataType = any>(object: string | undefined, command: string, data: any = undefined) => {
    if (!object) {
        throw new Error("Отсутствует объект запроса")
    }
    const { data: responseData, headers } = await instanse.post<ApiResponseType<dataType>>(`?q=${object}__${command}`, {
        object,
        command,
        data,
        jwt: localStorage.getItem("authToken") ?? undefined
    })
    //выгрузка простых документов (CSV, text)
    if (headers["content-type"].includes("text") || headers["content-type"].includes("excel")) {
        return responseData
    } else {
        if (responseData.status !== 200) {
            throw new Error(typeof responseData.data === "string" ? responseData.data : "Что-то пошло не так")
        } else {
            return responseData
        }
    }
}

const fileInstance = axios.create({
    baseURL: getApiUrl(),
    headers: {
        "Content-Type": "blob"
    },
    responseType: "arraybuffer"
})

export const fileApi = async <dataType = any>(object: string | undefined, command: string, data: any = undefined) => {
    if (!object) {
        throw new Error("Отсутствует объект запроса")
    }
    const { data: responseData, headers } = await fileInstance.post<ApiResponseType<dataType>>(`?q=${object}__${command}`, {
        object,
        command,
        data,
        jwt: localStorage.getItem("authToken") ?? undefined
    })
    //выгрузка простых документов (CSV, text)
    if (headers["content-type"].includes("text") || headers["content-type"].includes("excel")) {
        return responseData
    }
}

export const uploadFiles = async (object: string, command: string, data: any) => {
    const formData = new FormData()
    formData.append("object", object)
    formData.append("command", command)
    formData.append("jwt", localStorage.getItem("authToken") ?? "")

    for (let key in data) {
        const value = data[key]
        if (Array.isArray(value)) {
            value.forEach((arrayValue, index) => formData.append(`_${key}__${index}`, arrayValue))
        } else {
            formData.append(key, data[key])
        }
    }

    const { data: responseData } = await instanse.post<ApiResponseType<any>>(`?q=${object}__${command}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    if (responseData.status !== 200) {
        throw new Error(typeof responseData.data === "string" ? responseData.data : "Что-то пошло не так")
    } else {
        return responseData
    }
}

export const stringifyRequest = async (request: string) => {
    try {
        const stringAsJSON = JSON.parse(request)
        const { data: responseData, headers } = await instanse.post(`?q=toolbarRequest`, Object.assign({ jwt: localStorage.getItem("authToken") ?? undefined }, stringAsJSON))
        //выгрузка простых документов (CSV, text)
        if (headers["content-type"].includes("text")) {
            return responseData
        } else {
            if (responseData.status !== 200) {
                throw new Error(typeof responseData.data === "string" ? responseData.data : "Что-то пошло не так")
            } else {
                return responseData
            }
        }
    } catch (error) {
        //@ts-ignore
        getErrorToast(error.message)
    }
}


export default api