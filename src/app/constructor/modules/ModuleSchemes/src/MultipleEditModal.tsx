import { useFormikContext } from "formik"
import React, { useMemo } from "react"
import { Modal } from "react-bootstrap"
import ComponentInput from "../../../components/ComponentInput"
import ComponentSelect from "../../../components/ComponentSelect"
import { booleanResponsesList, objectPropTypes, objectPropView } from "../helpers/listsItems"
import setModalIndex from "../../../helpers/setModalIndex"
import {TMultipleEditModal} from "../_types";

const MultipleEditModal: React.FC<TMultipleEditModal> = ({show, setShow, currentSchemeCommands}) => {
    const {values: formikValues, setFieldValue} = useFormikContext<any>()
    const properties = formikValues.properties ?? []
    const propertiesToEdit = formikValues.additionals?.propertiesToEdit ?? []
    const propertiesToEditAsObjects = properties
    .map((property :any, index: number) => ({ ...property, index }))
    .filter((property: any) => propertiesToEdit.some((propertyToEdit: string) => propertyToEdit === property.article))
    const propertiesIndex = propertiesToEditAsObjects.map((property: any) => property.index)

    const currentSchemeCommandsForComponentSelect = useMemo(() => currentSchemeCommands.map(command => ({
        title: command,
        value: command
    })), [currentSchemeCommands])
   
    return <Modal
    size="xl"
    show={show}
    onHide={() => setShow(false)}
    onEntering={setModalIndex}
>
    <Modal.Header>
        <Modal.Title>
            Редактирование свойств
        </Modal.Title>
    </Modal.Header>

    <Modal.Body>
        <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                <thead>
                    <tr className='fw-bold text-muted'>
                        <th className='min-w-150px'>Свойство</th>
                        <th className='min-w-150px'>Общее</th>
                        {propertiesToEditAsObjects.map((property: any) => <th key={property.article} className='min-w-150px'>{property.article}</th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="fw-bold text-center fs-4">Тип</td>
                        <td>
                            <ComponentSelect article={`additionals.mass_data_type`} data_type="string" list={objectPropTypes}
                                customHandler={(value) => {
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].data_type`, value?.value)
                                    })
                                    return setFieldValue(`additionals.mass_data_type`, value?.value)
                                }} />
                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentSelect article={`properties[${property.index}].data_type`} data_type="string" list={objectPropTypes} />
                            </td>)}
                    </tr>

                    <tr>
                        <td className="fw-bold text-center fs-4">Отображение</td>
                        <td>
                            <ComponentSelect article={`additionals.mass_field_type`} data_type="string" list={objectPropView}
                                customHandler={(value) => {
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].field_type`, value?.value)
                                    })
                                    return setFieldValue(`additionals.mass_field_type`, value?.value)
                                }} />
                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentSelect article={`properties[${property.index}].field_type`} data_type="string" list={objectPropView} />
                            </td>)}
                    </tr>

                    <tr>
                        <td className="fw-bold text-center fs-4">Вывод в списке</td>
                        <td>
                            <ComponentSelect article={`additionals.mass_is_default_in_list`} data_type="string" list={booleanResponsesList}
                                customHandler={(value) => {
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].is_default_in_list`, value?.value)
                                    })
                                    return setFieldValue(`additionals.mass_is_default_in_list`, value?.value)
                                }} />
                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentSelect article={`properties[${property.index}].is_default_in_list`} data_type="string" list={booleanResponsesList} />
                            </td>)}
                    </tr>

                    <tr>
                        <td className="fw-bold text-center fs-4">Уникальность</td>
                        <td>
                            <ComponentSelect article={`additionals.mass_is_unique`} data_type="string" list={booleanResponsesList}
                                customHandler={(value) => {
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].is_unique`, value?.value)
                                    })
                                    return setFieldValue(`additionals.mass_is_unique`, value?.value)
                                }} />
                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentSelect article={`properties[${property.index}].is_unique`} data_type="string" list={booleanResponsesList} />
                            </td>)}
                    </tr>

                    <tr>
                        <td className="fw-bold text-center fs-4">Автозаполнение</td>
                        <td>
                            <ComponentSelect article={`additionals.mass_is_autofill`} data_type="string" list={booleanResponsesList}
                                customHandler={(value) => {
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].is_autofill`, value?.value)
                                    })
                                    return setFieldValue(`additionals.mass_is_autofill`, value?.value)
                                }} />
                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentSelect article={`properties[${property.index}].is_autofill`} data_type="string" list={booleanResponsesList} />
                            </td>)}
                    </tr>

                    <tr>
                        <td className="fw-bold text-center fs-4">Выводить в поиске</td>
                        <td>
                            <ComponentSelect article={`additionals.mass_is_in_search`} data_type="string" list={booleanResponsesList}
                                customHandler={(value) => {
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].is_in_search`, value?.value)
                                    })
                                    return setFieldValue(`additionals.mass_is_in_search`, value?.value)
                                }} />
                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentSelect article={`properties[${property.index}].is_in_search`} data_type="string" list={booleanResponsesList} />
                            </td>)}
                    </tr>

                    <tr>
                        <td className="fw-bold text-center fs-4">Вызов хука</td>
                        <td>
                            <ComponentSelect article={`additionals.mass_is_hook`} data_type="string" list={booleanResponsesList}
                                customHandler={(value) => {
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].is_hook`, value?.value)
                                    })
                                    return setFieldValue(`additionals.mass_is_hook`, value?.value)
                                }} />
                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentSelect article={`properties[${property.index}].is_hook`} data_type="string" list={booleanResponsesList} />
                            </td>)}
                    </tr>

                    <tr>
                        <td className="fw-bold text-center fs-4">Мин. значение</td>
                        <td>
                            <ComponentInput article={`additionals.mass_min_value`} field_type="integer"
                                customHandler={(event) => {
                                    const value = event.target.value
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].min_value`, value)
                                    })
                                    return setFieldValue(`additionals.mass_min_value`, value)
                                }} />

                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentInput article={`properties[${property.index}].min_value`} field_type="integer" />
                            </td>)}
                    </tr>

                    <tr>
                        <td className="fw-bold text-center fs-4">Макс. значение</td>
                        <td>
                            <ComponentInput article={`additionals.mass_max_value`} field_type="integer"
                                customHandler={(event) => {
                                    const value = event.target.value
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].max_value`, value)
                                    })
                                    return setFieldValue(`additionals.mass_max_value`, value)
                                }} />

                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentInput article={`properties[${property.index}].max_value`} field_type="integer" />
                            </td>)}
                    </tr>

                    <tr>
                        <td className="fw-bold text-center fs-4">Требуемые доступы</td>
                        <td>
                            <ComponentSelect article={`additionals.mass_required_permissions`} data_type="string" list={[]}
                                customHandler={(value) => {
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].required_permissions`, value?.value)
                                    })
                                    return setFieldValue(`additionals.mass_required_permissions`, value?.value)
                                }}
                                isDisabled
                            />
                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentSelect article={`properties[${property.index}].required_permissions`} data_type="string" list={[]}
                                    isDisabled />
                            </td>)}
                    </tr>


                    <tr>
                        <td className="fw-bold text-center fs-4">Требуемые модули</td>
                        <td>
                            <ComponentSelect article={`additionals.mass_required_modules`} data_type="string" list={[]}
                                customHandler={(value) => {
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].required_modules`, value?.value)
                                    })
                                    return setFieldValue(`additionals.mass_required_modules`, value?.value)
                                }}
                                isDisabled
                            />
                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentSelect article={`properties[${property.index}].required_modules`} data_type="string" list={[]}
                                    isDisabled />
                            </td>)}
                    </tr>


                    <tr>
                        <td className="fw-bold text-center fs-4">Используется в командах</td>
                        <td>
                            <ComponentSelect
                                article={`additionals.mass_use_in_commands`}
                                data_type="string"
                                list={currentSchemeCommandsForComponentSelect}
                                isMulti
                                customHandler={(value) => {
                                    const selectValues = Array.isArray(value) ? value.map(label => label.value) : []
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].use_in_commands`, selectValues)
                                    })
                                    return setFieldValue(`additionals.mass_use_in_commands`, selectValues)
                                }}
                            />
                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentSelect
                                    article={`properties[${property.index}].use_in_commands`}
                                    data_type="string"
                                    list={currentSchemeCommandsForComponentSelect}
                                    isMulti
                                />
                            </td>
                            )}
                    </tr>


                    <tr>
                        <td className="fw-bold text-center fs-4">Требуется для команд</td>
                        <td>
                            <ComponentSelect
                                article={`additionals.mass_require_in_commands`}
                                data_type="string"
                                list={currentSchemeCommandsForComponentSelect}
                                isMulti
                                customHandler={(value) => {
                                    const selectValues = Array.isArray(value) ? value.map(label => label.value) : []
                                    propertiesIndex.forEach((index: number) => {
                                        setFieldValue(`properties[${index}].require_in_commands`, selectValues)
                                    })
                                    return setFieldValue(`additionals.mass_require_in_commands`, selectValues)
                                }}
                            />
                        </td>
                        {propertiesToEditAsObjects.map((property: any) => <td key={property.article}>
                                <ComponentSelect
                                    article={`properties[${property.index}].require_in_commands`}
                                    data_type="string"
                                    list={currentSchemeCommandsForComponentSelect}
                                    isMulti
                                />
                            </td>
                            )}
                    </tr>

                </tbody>
            </table>
        </div>
        <div>
        </div>

    </Modal.Body>
</Modal>
}

export default MultipleEditModal