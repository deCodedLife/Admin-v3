import React, { useEffect, useMemo } from 'react'
import usePage from '../api/hooks/usePage'
import PageError from './PageError'
import PageBuilder from './PageBuilder'
import { useLocation, useNavigate } from 'react-router-dom'
import ComponentButton from '../constructor/components/ComponentButton'
import { useIntl } from 'react-intl'

const DynamicPageComponent: React.FC = () => {
    const { isFetching, error, data } = usePage()
    if (error) {
        return <PageError error={error as Error} />
    }
    return <PageBuilder isFetching={isFetching} data={data} />
}

const DynamicPage: React.FC = () => {
    const intl = useIntl()
    const { pathname } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const pathsArray = sessionStorage.getItem("paths") ?? JSON.stringify([])
        const resolvedPathsArray = JSON.parse(pathsArray) as Array<string>
        if (resolvedPathsArray.includes(pathname)) {
            const indexOfCurrentPath = resolvedPathsArray.indexOf(pathname)
            sessionStorage.setItem("paths", JSON.stringify(resolvedPathsArray.slice(0, indexOfCurrentPath)))
        }
        return () => {
            const pathsArray = sessionStorage.getItem("paths") ?? JSON.stringify([])
            const resolvedPathsArray = JSON.parse(pathsArray) as Array<string>
            const lastPath = resolvedPathsArray[resolvedPathsArray.length - 1]
            if (lastPath !== pathname) {
                resolvedPathsArray.push(pathname)
                sessionStorage.setItem("paths", JSON.stringify(resolvedPathsArray))
            }
        }
    }, [pathname])

    const handleReturnClick = () => {
        const pathsArray = sessionStorage.getItem("paths") ?? JSON.stringify([])
        const resolvedPathsArray = JSON.parse(pathsArray) as Array<string>
        if (resolvedPathsArray.length) {
            const currentPath = resolvedPathsArray[resolvedPathsArray.length - 1]
            navigate(currentPath)
        } else {
            navigate(pathname.slice(1).split("/")[0])
        }
    }

    const isSubpage = useMemo(() => {
        const slicedPathname = pathname.slice(1)
        const pathnameAsArray = slicedPathname.split("/")
        return pathnameAsArray.length > 1
    }, [pathname])
    return <>
        {isSubpage ? <ComponentButton
            type='custom'
            settings={{ title: intl.formatMessage({ id: "BUTTON.PREVIOUS" }), icon: "", background: "dark" }}
            customHandler={handleReturnClick} /> : null}
        <DynamicPageComponent />
    </>
}

export default DynamicPage