import React, { useCallback } from "react"; 
import { TModuleListUpdateField, TModuleListUpdateModal } from "../_types";
import ComponentInput from "../../../components/ComponentInput";
import ComponentTextarea from "../../../components/ComponentTextarea";
import ComponentSelect from "../../../components/ComponentSelect";
import ComponentPrice from "../../../components/ComponentPrice";
import ComponentPhone from "../../../components/ComponentPhone";
import ComponentDate from "../../../components/ComponentDate";
import ComponentCheckbox from "../../../components/ComponentCheckbox";
import ComponentInCreation from "../../../components/ComponentInCreation";
import { useIntl } from "react-intl";
import { useFormikContext } from "formik";
import { Modal } from "react-bootstrap";
import setModalIndex from "../../../helpers/setModalIndex";
import ComponentButton from "../../../components/ComponentButton";

const Field: React.FC<TModuleListUpdateField> = (props) => {
    const { article, data_type, field_type, list, customHandler, customChecked } = props
    switch (field_type) {
        case "string":
        case "year":
        case "integer":
        case "float":
        case "email":
        case "password":
            return <ComponentInput article={article} field_type={field_type} customHandler={customHandler} />
        case "textarea":
            return <ComponentTextarea article={article} customHandler={customHandler} />
        case "list":
            return <ComponentSelect
                article={article}
                data_type={data_type}
                list={list ?? []}
                isMulti={data_type === "array" ?? false}
                isClearable
                customHandler={customHandler}
            />
        case "price":
            return <ComponentPrice article={article} data_type={data_type} customHandler={customHandler} />
        case "phone":
            return <ComponentPhone article={article} customHandler={customHandler} />
        case "date":
        case "time":
        case "datetime":
            return <ComponentDate article={article} field_type={field_type} customHandler={customHandler} />
        case "checkbox":
            return <ComponentCheckbox article={article} customChecked={customChecked} customHandler={customHandler} />
        default:
            return <ComponentInCreation type={field_type} />
    }
}

export const UpdateFieldsModal: React.FC<TModuleListUpdateModal> = props => {
    const { showModal, fields, selectedItems, hideModal } = props
    const intl = useIntl()
    const { values, setFieldValue, handleSubmit } = useFormikContext<any>()
    const handleCloseModal = useCallback(() => {
        hideModal(false)
        setFieldValue("mode", "delete")
    }, [])
    return <Modal show={showModal} onHide={handleCloseModal} size="xl" onEntering={setModalIndex}>
        <Modal.Header closeButton>
            <Modal.Title>
                {intl.formatMessage({ id: "LIST.EDIT_MODAL_TITLE" })}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {fields ? <div className='table-responsive'>
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                    <thead>
                        <tr className='fw-bold text-muted'>
                            <th className='min-w-150px text-center'>{intl.formatMessage({ id: "LIST.EDIT_MODAL_PROPERTY_COLUMN" })}</th>
                            <th className='min-w-150px text-center'>{intl.formatMessage({ id: "LIST.EDIT_MODAL_COMMON_COLUMN" })}</th>
                            {selectedItems.map(item => <th key={item.id} className='min-w-150px text-center'>ID: <b>{item.id}</b></th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((field) => <tr key={field.article}>
                            <td className="fw-bold text-center fs-4">{field.title}</td>
                            <td>
                                <Field
                                    {...field}
                                    article={`additionals.${field.article}`}
                                    customHandler={field.field_type === "checkbox" ?
                                        () => {
                                            const currentValue = !(values.additionals?.[field.article])
                                            selectedItems.forEach((item: any, index: number) => {
                                                setFieldValue(`selectedItems[${index}].${field.article}`, currentValue)
                                            })
                                            return setFieldValue(`additionals.${field.article}`, currentValue)
                                        } :
                                        (value) => {
                                            const currentValue = value ?
                                                value.target ? value.target.value : Array.isArray(value) ?
                                                    value.map(option => option.value) : (value.value ?? value) : null
                                            selectedItems.forEach((item: any, index: number) => {
                                                setFieldValue(`selectedItems[${index}].${field.article}`, currentValue)
                                            })
                                            return setFieldValue(`additionals.${field.article}`, currentValue)
                                        }}

                                />
                            </td>
                            {selectedItems.map((item, index) => <td key={item.id}>  <Field {...field} article={`selectedItems[${index}].${field.article}`} /></td>)}
                        </tr>
                        )}
                    </tbody>
                </table>
                <div className="componentButton_container">
                    <ComponentButton
                        type="submit"
                        settings={{ title: intl.formatMessage({ id: "BUTTON.CANCEL" }), background: "light", icon: "" }}
                        customHandler={handleCloseModal}
                    />
                    <ComponentButton
                        type="submit"
                        settings={{ title: intl.formatMessage({ id: "BUTTON.SUBMIT" }), background: "dark", icon: "" }}
                        customHandler={() => {
                            hideModal(false)
                            handleSubmit()
                        }}
                    />
                </div>
            </div> : null}
        </Modal.Body>
    </Modal>
}