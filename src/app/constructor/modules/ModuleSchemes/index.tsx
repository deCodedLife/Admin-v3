import React, { useEffect, useMemo, useState } from "react"
import { Tab, Tabs } from "react-bootstrap"
import useMutate from "../../../api/hooks/useMutate"
import useSchemes from "../../../api/hooks/useSchemes"
import CommandsTab from "./src/CommandsTab"
import DatabasesTab from "./src/DatabasesTab"
import ObjectsTab from "./src/ObjectsTab"
import PagesTab from "./src/PagesTab"
import {TModuleSchemesTab} from "./_types";



const ModuleSchemesTab: React.FC<TModuleSchemesTab> = ({ type, schemes, tabs, mutate, deleteScheme }) => {
    switch (type) {
        case "command":
            return <CommandsTab schemes={schemes} mutate={mutate} deleteScheme={deleteScheme} />
        case "db":
            return <DatabasesTab schemes={schemes} mutate={mutate} deleteScheme={deleteScheme} />
        case "object":
            return <ObjectsTab schemes={schemes} tabs={tabs} mutate={mutate} deleteScheme={deleteScheme} />
        case "page":
            return <PagesTab schemes={schemes} mutate={mutate} deleteScheme={deleteScheme} />
        default:
            return <div>Ничего</div>
    }

}
const ModuleSchemes: React.FC = () => {
    const { data, refetch } = useSchemes()
    const { mutate, isSuccess } = useMutate("admin", "update-scheme")
    const { mutate: deleteScheme, isSuccess: isSuccessDelete } = useMutate("admin", "remove-scheme")
    const [key, setKey] = useState<string | null>(null)

    const tabs = useMemo(() => {
        if (!data) {
            return null
        } else {
            const tabs = Object.entries(data).map(([key, values]) => ({
                type: key,
                values
            }))
            //Влад попросил очередность изменить. Делается через указание очередности массивом и дальнейшей сортировке табов с использованием массива очередности 
            const tabsQueue = ["db", "object", "command", "page"]
            const tabsWithCurrectQueue = tabs.sort((a, b) => {
                return tabsQueue.findIndex(type => type === a.type) - tabsQueue.findIndex(type => type === b.type)
            })
            return tabsWithCurrectQueue
        }
    }, [data])

    useEffect(() => {
        if (tabs && !key) {
            setKey(tabs[0].type)
        }
    }, [tabs])

    useEffect(() => {
        if (isSuccess || isSuccessDelete) {
            refetch()
        }
    }, [isSuccess, isSuccessDelete])

    const getTabTitle = (type: string) => {
        switch (type) {
            case "command":
                return `Команды (${type})`
            case "db":
                return `Базы данных (${type})`
            case "object":
                return `Объекты (${type})`
            case "page":
                return `Страницы (${type})`
            default:
                return type
        }
    }

    if (tabs) {
        return <Tabs
            id="moduleShemes"
            activeKey={key as string | undefined}
            onSelect={(k) => setKey(k)}
            className="mb-3"
        >
            {tabs.map(({ type, values }) => <Tab className="moduleSchemes_tab" key={type} eventKey={type} title={getTabTitle(type)}>
                <div className="card">
                    <div className="card-body">
                        <ModuleSchemesTab type={type} schemes={values} tabs={tabs} mutate={mutate} deleteScheme={deleteScheme} />
                    </div>
                </div>
            </Tab>)}
        </Tabs>

    }
    return <div />


}

export default ModuleSchemes