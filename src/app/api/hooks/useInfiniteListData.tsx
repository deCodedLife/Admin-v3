import { useInfiniteQuery } from "react-query"
import api from ".."

const useInfiniteListData = (object: string, filter: any, enabled = true) => {
    const fetchKey = ["infiniteList", object, filter]

    const fetchFunction = ({pageParam = 1}) => api<Array<{[key: string]: any}>>(object, "get", {...filter, page: pageParam})

    const { isLoading, isFetching, isRefetching, error, data, hasNextPage, refetch, fetchNextPage  } = useInfiniteQuery(fetchKey, fetchFunction, {
        enabled,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
            const pageCount = lastPage.detail.pages_count
            const currentPageCount = pages.length 
            const nextPage = pageCount > currentPageCount ? currentPageCount + 1 : undefined
            return nextPage
        }
    })
    return { isLoading, isFetching, isRefetching, error, data, hasNextPage, refetch, fetchNextPage }
}

export default useInfiniteListData