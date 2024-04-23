import React, { useContext, useEffect, useState } from 'react'
import usePage from '../api/hooks/usePage'
import ErrorPage from './ErrorPage'
import PageBuilder from './PageBuilder'
import { useLocation, useNavigate } from 'react-router-dom'
import ComponentButton from '../constructor/components/ComponentButton'
import { useIntl } from 'react-intl'
import { useIsSubpage } from '../constructor/modules/helpers'
import { TComponentButtonSubmit } from '../constructor/components/ComponentButton/_types'


const HandleSubmitContext = React.createContext<React.Dispatch<React.SetStateAction<TComponentButtonSubmit | null>>>(() => { })
export const useHandleSubmitContext = () => useContext(HandleSubmitContext)

const DynamicPageComponent = React.memo(() => {

    const { isFetching, error, data } = usePage()
    if (error) {
        return <ErrorPage error={error as Error} />
    }
    return <PageBuilder isFetching={isFetching} data={data} />
})

const DynamicPage: React.FC = () => {
    const intl = useIntl()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [submitButton, setSubmitButton] = useState<TComponentButtonSubmit | null>(null)

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

    const isSubpage = useIsSubpage()

    return <HandleSubmitContext.Provider value={setSubmitButton}>
        {isSubpage ? <div className="componentButton_container inverse marginless paddingless">
            <ComponentButton
                type='custom'
                settings={{ title: intl.formatMessage({ id: "BUTTON.PREVIOUS" }), icon: "", background: "gray" }}
                customHandler={handleReturnClick} />
            {submitButton ? <ComponentButton {...submitButton} />: null}
        </div> : null}
        <DynamicPageComponent />
    </HandleSubmitContext.Provider>
}

export default DynamicPage