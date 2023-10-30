import { Formik, FormikProps, Form as FormikForm, useFormikContext, useField } from "formik"
import React, { useEffect, useMemo, useState } from "react"
import { Modal } from "react-bootstrap"
import useSchemes from "../../../api/hooks/useSchemes"
import ComponentButton from "../../components/ComponentButton"
import ComponentInput from "../../components/ComponentInput"
import ComponentSelect from "../../components/ComponentSelect"
import { titleFileFormatRemover } from "../helpers"
import ComponentArray from "../../components/ComponentArray"
import { ModuleSchemesButtonsContainer, ModuleSchemesField, ModuleSchemesFieldsRow, ModuleSchemesFieldsSection } from "./ModuleSchemesComponents"
import * as Yup from 'yup';
import { ModuleSchemesPageFormType, ModuleSchemesPagesTabType, ModuleSchemesPageStructureRowType } from "../../../types/modules"
import { ApiPageSchemeType } from "../../../types/api"
import { buttonsSettingsFields, pageModuleSize, pageModuleTypes } from "./helpers/listsItems"
import { booleanResponsesList } from "./helpers/listsItems"
import ComponentObject from "../../components/ComponentObject"
import setModalIndex from "../../helpers/setModalIndex"



const PageStructureArea: React.FC<{ parentArticle: string, area: any, setFieldValue: (article: string, value: any) => void, handleDeleteArea: () => void }> = ({ parentArticle, area, setFieldValue, handleDeleteArea }) => {
    const blocks = area.blocks ?? []
    const handleAddBlock = () => {
        const blocksClone = [...blocks]
        const initialBlockValues = {
            title: "",
            fields: []
        }
        blocksClone.push(initialBlockValues)
        setFieldValue(`${parentArticle}.blocks`, blocksClone)
    }

    const handleDeleteBlock = (index: number) => {
        const blocksClone = [...blocks]
        blocksClone.splice(index, 1)
        setFieldValue(`${parentArticle}.blocks`, blocksClone)
    }

    return <div style={{ marginBottom: "30px" }}>
        <ModuleSchemesFieldsRow>
            <ModuleSchemesField title="Размер" size={3}>
                <ComponentSelect article={`${parentArticle}.size`} data_type="integer" list={[
                    { title: "1", value: 1 },
                    { title: "2", value: 2 },
                    { title: "3", value: 3 },
                    { title: "4", value: 4 }
                ]} />
            </ModuleSchemesField>
        </ModuleSchemesFieldsRow>
        {blocks.map((block: any, index: number) => <div style={{ paddingLeft: "30px", marginBottom: "10px" }}>
            <ModuleSchemesFieldsRow>
                <ModuleSchemesField title="Заголовок" size={3}>
                    <ComponentInput article={`${parentArticle}.blocks[${index}].title`} field_type="string" />
                </ModuleSchemesField>
            </ModuleSchemesFieldsRow>
            <ModuleSchemesFieldsRow>
                <ModuleSchemesField title="Поля" size={12}>
                    <ComponentArray article={`${parentArticle}.blocks[${index}].fields`} data_type="string" draggable />
                </ModuleSchemesField>
            </ModuleSchemesFieldsRow>
            <ComponentButton type="custom" settings={{ title: "Удалить блок", background: "danger", icon: "" }} customHandler={() => handleDeleteBlock(index)} />
        </div>)}
        <div className="componentButton_container">
            <ComponentButton type="custom" settings={{ title: "Добавить блок", background: "light", icon: "" }} customHandler={handleAddBlock} />
            <ComponentButton type="custom" settings={{ title: "Удалить область", background: "danger", icon: "" }} customHandler={handleDeleteArea} />
        </div>

    </div>

}

const PageStructureTab: React.FC<{
    parentArticle: string, structure: Array<any>, index: number, isLastTab: boolean,
    setFieldValue: (article: string, value: any) => void, handleDeleteTab: () => void,
    handleSwapTabs: (tabIndex: number, direction: number) => void
}> = ({ parentArticle, structure, index, isLastTab, setFieldValue, handleDeleteTab, handleSwapTabs }) => {
    const handleAppendStructure = () => {
        const propertyInitialValues = {
            title: "",
            type: "",
            size: 4,
            settings: null,
            components: []
        }
        const structureValuesClone = Array.isArray(structure) ? [...structure] : []
        structureValuesClone.push(propertyInitialValues)
        return setFieldValue(`${parentArticle}.body`, structureValuesClone)
    }
    const handleDeleteStructureRow = (structureRow: any) => {
        const structureValuesClone = [...structure]
        const rowIndex = structureValuesClone.indexOf(structureRow)
        structureValuesClone.splice(rowIndex, 1)
        return setFieldValue(`${parentArticle}.body`, structureValuesClone)
    }

    return <div className="moduleSchemes_pageTab">
        <ComponentButton
            className="moduleSchemes_pageTabButton"
            type="custom" settings={{ title: "", icon: "arrow", background: "light" }}
            defaultLabel="icon"
            customHandler={() => handleSwapTabs(index, -1)}
            disabled={index === 0}

        />
        <ComponentButton
            className="moduleSchemes_pageTabButton down"
            type="custom"
            settings={{ title: "", icon: "arrow", background: "light" }}
            defaultLabel="icon"
            customHandler={() => handleSwapTabs(index, 1)}
            disabled={isLastTab}
        />
        <ModuleSchemesFieldsRow>
            <ModuleSchemesField title="Заголовок" size={3}>
                <ComponentInput article={`${parentArticle}.title`} field_type="string" />
            </ModuleSchemesField>
            <ModuleSchemesField title="Счетчик" size={3}>
                <ComponentSelect article={`${parentArticle}.is_counter`} data_type="boolean" list={booleanResponsesList} />
            </ModuleSchemesField>
        </ModuleSchemesFieldsRow>
        <ModuleSchemesFieldsSection>
            <div className='table-responsive'>
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                    <thead>
                        <tr className='fw-bold text-muted'>
                            <th className='min-w-150px required'>Название</th>
                            <th className='min-w-150px required'>Тип</th>
                            <th className='min-w-150px required'>Размер</th>
                        </tr>
                    </thead>
                    <tbody>
                        {structure.map((structure, index) => (
                            <PageStructureRow
                                parentArticle={`${parentArticle}.body[${index}]`}
                                structure={structure}
                                handleDelete={handleDeleteStructureRow}
                                setFieldValue={setFieldValue}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </ModuleSchemesFieldsSection>
        <ModuleSchemesButtonsContainer>
            <ComponentButton
                type="custom"
                settings={{ title: "Добавить структуру", background: "dark", icon: "" }}
                customHandler={handleAppendStructure} />
            <ComponentButton type="custom" settings={{ title: "Удалить вкладку", background: "danger", icon: "" }} customHandler={handleDeleteTab} />
        </ModuleSchemesButtonsContainer>
    </div>

}


const PageStructureSettings: React.FC<{ parentArticle: string }> = ({ parentArticle }) => {
    const [{ value }] = useField(parentArticle)
    const { setFieldValue, initialValues } = useFormikContext<any>()
    const { type, settings } = value
    const areas = settings?.areas ?? []
    const handleAddArea = () => {
        const areasClone = [...areas]
        const initialAreaValues = {
            size: null,
            blocks: []
        }
        areasClone.push(initialAreaValues)
        setFieldValue(`${parentArticle}.settings.areas`, areasClone)
    }
    const handleDeleteArea = (index: number) => {
        const areasClone = [...areas]
        areasClone.splice(index, 1)
        setFieldValue(`${parentArticle}.settings.areas`, areasClone)
    }
    const handleAddTab = () => {
        const tabsClone = Array.isArray(settings) ? [...settings] : []
        const initialTabValues = {
            title: "",
            body: []
        }
        tabsClone.push(initialTabValues)
        setFieldValue(`${parentArticle}.settings`, tabsClone)
    }
    const handleDeleteTab = (index: number) => {
        const tabsClone = [...settings]
        tabsClone.splice(index, 1)
        setFieldValue(`${parentArticle}.settings`, tabsClone)
    }
    const handleSwapTabs = (tabIndex: number, direction: number) => {
        const tabsClone = [...settings]
        const currentTab = tabsClone[tabIndex]
        tabsClone.splice(tabIndex, 1)
        tabsClone.splice(tabIndex + direction, 0, currentTab)
        setFieldValue(`${parentArticle}.settings`, tabsClone)
    }

    switch (type) {
        case "header":
            return <>
                <ModuleSchemesFieldsRow>
                    <ModuleSchemesField title="Описание" size={3}>
                        <ComponentInput article={`${parentArticle}.settings.description`} field_type="string" />
                    </ModuleSchemesField>
                </ModuleSchemesFieldsRow>
                <ModuleSchemesFieldsRow>
                    <ModuleSchemesField title="Заголовок для вывода" size={12}>
                        <ComponentArray article={`${parentArticle}.settings.title`} data_type="string" draggable />
                    </ModuleSchemesField>
                </ModuleSchemesFieldsRow>
            </>
        case "form":
        case "info":
            return <>
                <ModuleSchemesFieldsRow>
                    <ModuleSchemesField title="Объект" size={3}>
                        <ComponentInput article={`${parentArticle}.settings.object`} field_type="string" />
                    </ModuleSchemesField>
                    <ModuleSchemesField title="Команда" size={3}>
                        <ComponentInput article={`${parentArticle}.settings.command`} field_type="string" />
                    </ModuleSchemesField>
                </ModuleSchemesFieldsRow>
                <ModuleSchemesFieldsSection title="Области">
                    {areas?.map((area: any, index: number) => <PageStructureArea
                        parentArticle={`${parentArticle}.settings.areas[${index}]`}
                        area={area}
                        setFieldValue={setFieldValue}
                        handleDeleteArea={() => handleDeleteArea(index)}
                    />)}
                    <ComponentButton type="custom" settings={{ title: "Добавить область", background: "dark", icon: "" }} customHandler={handleAddArea} />
                </ModuleSchemesFieldsSection>

            </>
        case "schedule_list":
        case "list":
            return <>
                <ModuleSchemesFieldsRow>
                    <ModuleSchemesField title="Объект" size={3}>
                        <ComponentInput article={`${parentArticle}.settings.object`} field_type="string" />
                    </ModuleSchemesField>
                    <ModuleSchemesField title="Выгрузка в CSV" size={3}>
                        <ComponentSelect article={`${parentArticle}.settings.is_csv`} data_type="boolean" list={booleanResponsesList} />
                    </ModuleSchemesField>
                    <ModuleSchemesField title="Редактирование" size={3}>
                        <ComponentSelect article={`${parentArticle}.settings.is_edit`} data_type="boolean" list={booleanResponsesList} />
                    </ModuleSchemesField>
                </ModuleSchemesFieldsRow>
                <ModuleSchemesFieldsRow>
                    <ModuleSchemesField title="Контекст" size={12}>
                        <ComponentObject article={`${parentArticle}.settings.context`} />
                    </ModuleSchemesField>
                </ModuleSchemesFieldsRow>
            </>
        case "analytic_widgets":
            return <>
                <ModuleSchemesFieldsRow>
                    <ModuleSchemesField title="Группа виджетов (объект)" size={3}>
                        <ComponentInput article={`${parentArticle}.settings.widgets_group`} field_type="string" />
                    </ModuleSchemesField>
                </ModuleSchemesFieldsRow>
                <ModuleSchemesFieldsRow>
                    <ModuleSchemesField title="Фильтры" size={12}>
                        <ComponentArray label="property" article={`${parentArticle}.settings.filters`} data_type="object" fields={[
                            {
                                title: "Свойство",
                                article: "property",
                                type: "input",
                            },
                            {
                                title: "Значение",
                                article: "value",
                                type: "input",
                            }
                        ]} />
                    </ModuleSchemesField>
                </ModuleSchemesFieldsRow>
            </>
        case "schedule":
            return <>
                <ModuleSchemesFieldsRow>
                    <ModuleSchemesField title="Объект" size={4}>
                        <ComponentInput article={`${parentArticle}.settings.object`} field_type="string" />
                    </ModuleSchemesField>
                </ModuleSchemesFieldsRow>
                <ModuleSchemesFieldsRow>
                    <ModuleSchemesField title="Таблица" size={4}>
                        <ComponentInput article={`${parentArticle}.settings.performers_table`} field_type="string" />
                    </ModuleSchemesField>
                    <ModuleSchemesField title="Артикул" size={4}>
                        <ComponentInput article={`${parentArticle}.settings.performers_row_article`} field_type="string" />
                    </ModuleSchemesField>
                    <ModuleSchemesField title="Заголовок" size={4}>
                        <ComponentInput article={`${parentArticle}.settings.performers_row_title`} field_type="string" />
                    </ModuleSchemesField>
                </ModuleSchemesFieldsRow>
                <ModuleSchemesFieldsRow>
                    <ModuleSchemesField title="Ссылка на страницу добавления записи" size={4}>
                        <ComponentInput article={`${parentArticle}.settings.row_href`} field_type="string" />
                    </ModuleSchemesField>
                </ModuleSchemesFieldsRow>
            </>
        case "chat":
            return <>
                <ModuleSchemesFieldsSection title="Группы">
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Объект" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.groups.objects`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Свойство для фильтрации" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.groups.property`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                </ModuleSchemesFieldsSection>
                <ModuleSchemesFieldsSection title="Чаты">
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Объект" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.chats.objects`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Свойство для фильтрации" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.chats.property`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                </ModuleSchemesFieldsSection>
                <ModuleSchemesFieldsSection title="Сообщения">
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Объект" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.messages.objects`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                </ModuleSchemesFieldsSection>
            </>
        case "mini_chat":
            return <>
                <ModuleSchemesFieldsSection>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Объект" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.object`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Свойство для фильтрации" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.filter_property`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                </ModuleSchemesFieldsSection>
            </>
        case "tabs":
            return <>
                <ModuleSchemesFieldsSection title="Вкладки">
                    {settings?.map?.((tab: any, index: number, tabs: Array<any>) => <PageStructureTab
                        parentArticle={`${parentArticle}.settings[${index}]`}
                        structure={tab.body}
                        index={index}
                        isLastTab={tabs.length - 1 === index}
                        setFieldValue={setFieldValue}
                        handleDeleteTab={() => handleDeleteTab(index)}
                        handleSwapTabs={handleSwapTabs}
                    />)}
                    <ComponentButton type="custom" settings={{ title: "Добавить вкладку", background: "dark", icon: "" }} customHandler={handleAddTab} />
                </ModuleSchemesFieldsSection>
            </>
        case "calendar":
        case "logs":
            return <>
                <ModuleSchemesFieldsSection>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Объект" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.object`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Фильтры" size={12}>
                            <ComponentArray label="property" article={`${parentArticle}.settings.filters`} data_type="object" fields={[
                                { title: "Свойство", article: "property", type: "input" },
                                { title: "Значение", article: "value", type: "input" }
                            ]} />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                </ModuleSchemesFieldsSection>
            </>
        case "funnel":
            return <>
                <ModuleSchemesFieldsSection>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Фильтр (колонки)" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.filter`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Объект (строки)" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.object`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Свойство для фильтрации" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.property`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                </ModuleSchemesFieldsSection>
            </>
        case "news":
            return <>
                <ModuleSchemesFieldsSection>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Объект" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.object`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Свойство заголовка новости" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.property_title`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Свойство изображения новости" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.property_image`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Свойство превью новости" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.property_preview`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Свойство 'тела' новости" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.property_body`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                </ModuleSchemesFieldsSection>
            </>
        case "links_block":
            return <>
                <ModuleSchemesFieldsSection>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Заголовок блока" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.title`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Ссылки" size={12}>
                            <ComponentArray label="title" article={`${parentArticle}.settings.links`} data_type="object" fields={[
                                { title: "Заголовок", article: "title", type: "input" },
                                { title: "Иконка", article: "icon", type: "input" },
                                { title: "Переход на страницу", article: "link", type: "input" }
                            ]} />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                </ModuleSchemesFieldsSection>
            </>
        case "accordion":
            return <>
                <ModuleSchemesFieldsSection>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Объект" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.object`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Свойство заголовка" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.property_title`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Свойство 'тела'" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.property_body`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Фильтры" size={12}>
                            <ComponentArray label="property" article={`${parentArticle}.settings.filters`} data_type="object" fields={[
                                { title: "Свойство", article: "property", type: "input" },
                                { title: "Значение", article: "value", type: "input" }
                            ]} />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                </ModuleSchemesFieldsSection>
            </>
        case "day_planning":
            return <>
                <ModuleSchemesFieldsSection>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Объект" size={4}>
                            <ComponentInput article={`${parentArticle}.settings.object`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Время записи (от)" size={4}>
                            <ComponentInput article={`${parentArticle}.settings.time_from_property`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Время записи (до)" size={4}>
                            <ComponentInput article={`${parentArticle}.settings.time_to_property`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>

                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Описание записи" size={4}>
                            <ComponentInput article={`${parentArticle}.settings.body_property`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Статус записи" size={4}>
                            <ComponentInput article={`${parentArticle}.settings.status_property`} field_type="string" />
                        </ModuleSchemesField>
                        <ModuleSchemesField title="Ссылки записи" size={4}>
                            <ComponentInput article={`${parentArticle}.settings.links_property`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                </ModuleSchemesFieldsSection>
            </>
        case "queue":
            return <>
                <ModuleSchemesFieldsSection>
                    <ModuleSchemesFieldsRow>
                        <ModuleSchemesField title="Объект" size={3}>
                            <ComponentInput article={`${parentArticle}.settings.object`} field_type="string" />
                        </ModuleSchemesField>
                    </ModuleSchemesFieldsRow>
                </ModuleSchemesFieldsSection>
            </>
        default:
            return <div />
    }
}

const PageStructureRow: React.FC<ModuleSchemesPageStructureRowType> = ({ parentArticle, structure, handleDelete, setFieldValue }) => {
    const [extendedProperties, showExtendedProperties] = useState(false)
    const handleShowExtendedProperties = () => showExtendedProperties(true)

    const filterFieldsForComponentArray = useMemo(() => {
        return [
            {
                title: "Заголовок",
                article: "title",
                type: "input",
                size: 12
            },
            {
                title: "Заполнение",
                article: "placeholder",
                type: "input",
                size: 6
            },
            {
                title: "Тип",
                article: "type",
                type: "select",
                list: [
                    { title: "list", value: "list" },
                    { title: "date", value: "date" },
                    { title: "integer", value: "integer" },
                    { title: "price", value: "price" },
                    { title: "checkbox", value: "checkbox" },
                ],
                size: 6
            },
            {
                title: "Необходимые модули",
                article: "required_modules",
                type: "select",
                list: [],
                isMulti: true,
                size: 6
            },
            {
                title: "Необходимые доступы",
                article: "required_permissions",
                type: "select",
                list: [],
                isMulti: true,
                size: 6
            },
            {
                title: "Источник списка (объект)",
                article: "settings.donor_object",
                type: "input",
                size: 6
            },
            {
                title: "Заголовок списка",
                article: "settings.donor_property_title",
                type: "input",
                size: 6
            },
            {
                title: "Значение списка",
                article: "settings.donor_property_value",
                type: "input",
                size: 6
            },
            {
                title: "Возвращаемое значение",
                article: "settings.recipient_property",
                type: "input",
                size: 6
            },
        ]
    }, [])

    const [{ value }, meta, { setValue }] = useField(`${parentArticle}.components`)
    const handleComponentsChange = (article: string, values: any) => {
        const isEmptyProperty = Array.isArray(value)
        const currentParentValue = isEmptyProperty ? {} : { ...value }
        currentParentValue[article] = values
        setValue(currentParentValue)
    }
    const handleChangeType = (value: { label: string, value: string }) => {
        setFieldValue(`${parentArticle}.type`, value.value)
        setFieldValue(`${parentArticle}.settings`, null)
    }
    return <tr>
        <td>
            <ComponentInput article={`${parentArticle}.title`} field_type="string" />
        </td>
        <td>
            <ComponentSelect
                article={`${parentArticle}.type`}
                data_type="string"
                list={pageModuleTypes}
                customHandler={handleChangeType}
            />
        </td>
        <td>
            <ComponentSelect article={`${parentArticle}.size`} data_type="integer" list={pageModuleSize} />
        </td>
        <td>
            <div className="moduleSchemes_actionsCell">
                <ComponentButton
                    type="custom"
                    settings={{ background: "light", icon: "list", title: "Развернуть" }}
                    customHandler={handleShowExtendedProperties}
                    defaultLabel="icon" />
                <Modal
                    size="xl"
                    show={extendedProperties}
                    onHide={() => showExtendedProperties(false)}
                    onEntering={setModalIndex}
                >
                    <Modal.Header>
                        <Modal.Title>
                            Расширенные свойства
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ModuleSchemesFieldsSection>
                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Название" size={3} required>
                                    <ComponentInput article={`${parentArticle}.title`} field_type="string" />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Тип" size={3} required>
                                    <ComponentSelect
                                        article={`${parentArticle}.type`}
                                        data_type="string"
                                        list={pageModuleTypes}
                                        customHandler={handleChangeType}
                                    />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Размер" size={3} required>
                                    <ComponentSelect article={`${parentArticle}.size`} data_type="integer" list={pageModuleSize} />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>
                        </ModuleSchemesFieldsSection>

                        <ModuleSchemesFieldsSection title="Компоненты">
                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Кнопки" size={12}>
                                    <ComponentArray
                                        label="settings.title"
                                        article={`${parentArticle}.components.buttons`}
                                        data_type="object"
                                        fields={buttonsSettingsFields}
                                        customHandler={(values: any) => handleComponentsChange("buttons", values)}
                                        draggable
                                    />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>
                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Фильтры" size={12}>
                                    <ComponentArray
                                        label="title"
                                        article={`${parentArticle}.components.filters`}
                                        data_type="object"
                                        fields={filterFieldsForComponentArray}
                                        customHandler={(values: any) => handleComponentsChange("filters", values)}
                                        draggable
                                    />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>
                        </ModuleSchemesFieldsSection>

                        <ModuleSchemesFieldsSection title="Настройки">
                            <PageStructureSettings parentArticle={parentArticle} />
                        </ModuleSchemesFieldsSection>
                    </Modal.Body>
                </Modal>

                <ComponentButton
                    type="custom"
                    settings={{ background: "light", icon: "trash", title: "Удалить свойство" }}
                    customHandler={() => handleDelete(structure)}
                    defaultLabel="icon" />
            </div>
        </td>
    </tr>
}
const PageForm: React.FC<ModuleSchemesPageFormType> = ({ data, selectedScheme, mutate, deleteScheme = () => { } }) => {

    const isCreating = !Boolean(selectedScheme)

    const handleSubmit = (values: any) => {
        const valuesClone = { ...values }
        const newSchemeName = `${valuesClone.section}/${valuesClone.page}`
        delete valuesClone.section
        delete valuesClone.page
        mutate({
            scheme_type: "page",
            scheme_name: isCreating ? newSchemeName : selectedScheme,
            scheme_body: JSON.stringify(valuesClone)
        })
    }

    const handleDelete = (values: any) => {
        const valuesClone = { ...values }
        deleteScheme({
            scheme_type: "page",
            scheme_name: selectedScheme,
            scheme_body: JSON.stringify(valuesClone)
        })
    }

    const validationSchema = isCreating ? Yup.object().shape({
        section: Yup.string().required(" "),
        page: Yup.string().required(" "),
        structure: Yup.array().of(Yup.object({
            title: Yup.string().required(" "),
            type: Yup.string().required(" "),
            size: Yup.number().required(" ")
        }))
    }) : Yup.object().shape({
        structure: Yup.array().of(Yup.object({
            title: Yup.string().required(" "),
            type: Yup.string().required(" "),
            size: Yup.number().required(" ")
        }))
    })


    return <div className="moduleSchemes_form_container">
        <Formik enableReinitialize initialValues={data} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {(props: FormikProps<typeof data>) => {
                const { values, setFieldValue, handleSubmit } = props

                const handleAppendStructure = () => {
                    const propertyInitialValues = {
                        title: "",
                        type: "",
                        size: 4,
                        settings: null,
                        components: []
                    }
                    const structureValuesClone = Array.isArray(values.structure) ? [...values.structure] : []
                    structureValuesClone.push(propertyInitialValues)
                    return setFieldValue("structure", structureValuesClone)
                }



                const handleDeleteStructureRow = (structureRow: any) => {
                    const structureValuesClone = [...values.structure]
                    const rowIndex = structureValuesClone.indexOf(structureRow)
                    structureValuesClone.splice(rowIndex, 1)
                    setFieldValue("structure", structureValuesClone)
                }

                return <FormikForm className="moduleSchemes_form">
                    <ModuleSchemesFieldsSection>
                        {
                            isCreating ? <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Раздел" size={3} required>
                                    <ComponentInput article="section" field_type="string" />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Страница" size={3} required>
                                    <ComponentInput article="page" field_type="string" />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow> : null
                        }
                        <ModuleSchemesFieldsRow>
                            <ModuleSchemesField title="Требуемые доступы" size={6}>
                                <ComponentSelect article="required_permissions" data_type="string" list={[]} isDisabled />
                            </ModuleSchemesField>
                            <ModuleSchemesField title="Требуемые модули" size={6}>
                                <ComponentSelect article="required_modules" data_type="string" list={[]} isDisabled />
                            </ModuleSchemesField>
                        </ModuleSchemesFieldsRow>
                    </ModuleSchemesFieldsSection>

                    <ModuleSchemesFieldsSection title="Структура" className="propertiesSection">
                        <div className='table-responsive'>
                            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                                <thead>
                                    <tr className='fw-bold text-muted'>
                                        <th className='min-w-150px required'>Название</th>
                                        <th className='min-w-150px required'>Тип</th>
                                        <th className='min-w-150px required'>Размер</th>
                                        <th className="moduleSchemes_actionsCellHead"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.values.structure.map((structure, index) => (
                                        <PageStructureRow
                                            parentArticle={`structure[${index}]`}
                                            structure={structure}
                                            handleDelete={handleDeleteStructureRow}
                                            setFieldValue={setFieldValue}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ModuleSchemesFieldsSection>

                    <ModuleSchemesButtonsContainer>
                        <ComponentButton
                            type="custom"
                            settings={{ title: "Добавить структуру", background: "dark", icon: "" }}
                            customHandler={handleAppendStructure} />
                        <ComponentButton
                            type="submit"
                            settings={{ title: "Сохранить изменения", background: "dark", icon: "" }}
                            customHandler={handleSubmit} />
                        {
                            !isCreating ? <ComponentButton
                                type="custom"
                                settings={{ title: "Удалить страницу", background: "danger", icon: "" }}
                                customHandler={() => handleDelete(values)} /> : null
                        }

                    </ModuleSchemesButtonsContainer>
                </FormikForm>
            }}
        </Formik>
    </div>
}
const PagesTab: React.FC<ModuleSchemesPagesTabType> = ({ schemes, mutate, deleteScheme }) => {
    const [selectedScheme, setSelectedScheme] = useState<string | undefined>(undefined)
    const { data } = useSchemes<ApiPageSchemeType>("page", "page", selectedScheme)
    const [createNewScheme, setCreateNewScheme] = useState(false)
    const schemesBySections = Object.entries<Array<string>>(schemes)

    useEffect(() => {
        if (selectedScheme) {
            const [section, schemeName] = selectedScheme.split("/")
            const isIncludeScheme = schemes[section]?.some((scheme: string) => scheme.includes(schemeName))
            if (!isIncludeScheme) {
                setSelectedScheme(undefined)
            }
        }
    }, [schemes])

    const initialFormValues = useMemo(() => {
        return {
            section: "",
            page: "",
            required_modules: [],
            required_permissions: [],
            structure: []
        }
    }, [])
    const sections = useMemo(() => {
        return schemesBySections.map(sectionWithSchemes => sectionWithSchemes[0])
    }, [schemesBySections])
    return <div className="d-flex">
        <div className="moduleSchemes_schemeList_container">
            <Formik enableReinitialize initialValues={{ search: "", schemes: schemesBySections, visibleSchemes: schemesBySections }} onSubmit={() => { }}>
                {({ setFieldValue, values }) => <FormikForm>
                    <div className="moduleSchemes_searchContainer">
                        <ComponentInput article="search" field_type="string" customHandler={event => {
                            const inputValue = event.target.value
                            setFieldValue("search", inputValue)
                            if (inputValue.length === 0 || inputValue.length >= 3) {
                                /*
                                --- фильтрация по страницам 
                                */
                                /*   const filteredSchemes = values.schemes
                                      .map(section => {
                                          const filteredCommands = section[1]
                                              .map(command => command.replace(/\.\w+/, ""))
                                              .filter(command => command.includes(inputValue))
                                              .map(command => command + ".json")
                                          return [section[0], filteredCommands]
                                      })
                                      .filter(section => section[1].length) */

                                /* 
                                --- фильтрация по разделам
                                */
                               const filteredSchemes = values.schemes.filter(section => section[0].includes(inputValue))
                                setFieldValue("visibleSchemes", filteredSchemes)
                            }
                        }} />
                    </div>
                    <ul className="moduleSchemes_schemeList">
                        {values.visibleSchemes.map(([sectionTitle, sectionValues]: Array<any>) => <>
                            <li><h4>{sectionTitle}</h4></li>
                            {sectionValues.map((scheme: string) => <li onClick={() => setSelectedScheme(`${sectionTitle}/${titleFileFormatRemover(scheme)}`)}>
                                <div className={`moduleSchemes_schemeList_item${selectedScheme === `${sectionTitle}/${titleFileFormatRemover(scheme)}` ? " selected" : ""}`}>
                                    {titleFileFormatRemover(scheme)}
                                </div>
                            </li>)}
                        </>)}
                    </ul>
                    {selectedScheme ?
                        <ComponentButton type="custom" settings={{ title: "Новая страница", icon: "", background: "dark" }} customHandler={() => setCreateNewScheme(true)} /> : null}
                </FormikForm>}
            </Formik>


        </div>
        <div className="moduleSchemes_content">
            {selectedScheme && data ? <PageForm data={data} selectedScheme={selectedScheme} mutate={mutate} deleteScheme={deleteScheme} /> :
                <ComponentButton type="custom" settings={{ title: "Новая страница", icon: "", background: "dark" }} customHandler={() => setCreateNewScheme(true)} />}
        </div>
        <Modal
            size="xl"
            show={createNewScheme}
            onHide={() => setCreateNewScheme(false)}
            onEntering={setModalIndex}
        >
            <Modal.Header>
                <Modal.Title>
                    Создание
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PageForm data={initialFormValues} mutate={mutate} />
            </Modal.Body>
        </Modal>
    </div>
}

export default React.memo(PagesTab)