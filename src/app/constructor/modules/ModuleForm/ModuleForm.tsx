import React, { useCallback, useContext, useEffect, useMemo } from "react"
import { Form as FormikForm, Formik, useField } from "formik"
import ComponentButton from "../../components/ComponentButton"
import { Col, Form } from "react-bootstrap"
import ComponentInput from "../../components/ComponentInput"
import ComponentSelect from "../../components/ComponentSelect"
import useMutate from "../../../api/hooks/useMutate"
import { getFields, getInitialValues, getValidationSchema } from "../helpers"
import { useLocation, useNavigate } from "react-router-dom"
import { ModuleFormAreaType, ModuleFormBlockType, ModuleFormFieldType, ModuleFormType } from "../../../types/modules"
import { ComponentButtonType } from "../../../types/components"
import ComponentInCreation from "../../components/ComponentInCreation"
import ComponentTextarea from "../../components/ComponentTextarea"
import ComponentPrice from "../../components/ComponentPrice"
import ComponentPhone from "../../components/ComponentPhone"
import ComponentDate from "../../components/ComponentDate"
import ComponentCheckbox from "../../components/ComponentCheckbox"
import ComponentAddress from "../../components/ComponentAddress"
import { ModalContext } from "../ModuleSchedule/ModuleSchedule"
import ComponentImage from "../../components/ComponentImage"
import useMutateWithFiles from "../../../api/hooks/useMutateWithFiles"
import ComponentTextEditor from "../../components/ComponentTextEditor"
import ComponentFile from "../../components/ComponentFile"
import ComponentRadio from "../../components/ComponentRadio"
import ComponentInfoStrings from "../../components/ComponentInfoStrings"
import ComponentSmartList from "../../components/ComponentSmartList"
import ComponentLayout from "../../components/ComponentLayout"
import ComponentTooltip from "../../components/ComponentTooltip"
import ComponentAnnotation from "../../components/ComponentAnnotation"
import InfoModal from "./InfoModal"
import ComponentGooglePlaces from "../../components/ComponentGooglePlaces"
//Тип поля
export const Component: React.FC<ModuleFormFieldType> = (props) => {
    const { article, data_type, field_type, is_disabled, hook, is_clearable, object_id, request_object } = props
    switch (field_type) {
        case "string":
        case "year":
        case "integer":
        case "float":
        case "email":
        case "password":
            return <ComponentInput
                article={article}
                field_type={field_type}
                is_disabled={Boolean(is_disabled)}
                hook={hook}
            />
        case "textarea":
            return <ComponentTextarea
                article={article}
                is_disabled={Boolean(is_disabled)}
                rows={props.settings?.rows}
            />
        case "list":
            const { joined_field, joined_field_filter, search, settings, on_change_submit } = props
            return <ComponentSelect
                article={article}
                data_type={data_type}
                list={props.list ?? []}
                isDisabled={Boolean(is_disabled)}
                isMulti={data_type === "array" ?? false}
                hook={hook}
                joined_field={joined_field}
                joined_field_filter={joined_field_filter}
                isDuplicate={settings?.is_duplicate ?? false}
                object={settings?.object}
                select={settings?.select}
                search={search}
                isClearable={(is_clearable === false) ? is_clearable : true}
                onChangeSubmit={on_change_submit}

            />
        case "price":
            return <ComponentPrice
                article={article}
                data_type={data_type}
                hook={hook}
                is_disabled={Boolean(is_disabled)}
            />
        case "phone":
            return <ComponentPhone
                article={article}
                is_disabled={Boolean(is_disabled)}
            />
        case "date":
        case "time":
        case "datetime":
        case "month":
            return <ComponentDate
                article={article}
                field_type={field_type}
                is_disabled={Boolean(is_disabled)}
                hook={hook}
            />
        case "checkbox":
            return <ComponentCheckbox
                article={article}
                is_disabled={Boolean(is_disabled)}
                hook={hook}
            />
        case "dadata_address":
        case "dadata_country":
        case "dadata_region":
        case "dadata_local_area":
        case "dadata_city":
        case "dadata_street":
            return <ComponentAddress
                article={article}
                field_type={field_type}
                is_disabled={Boolean(is_disabled)}
            />
        case "google_address":
            return <ComponentGooglePlaces
                article={article}
                is_disabled={Boolean(is_disabled)}
            />
        case "image":
            return <ComponentImage
                article={article}
                allowedFormats={props.settings?.allowed_formats}
                is_multiply={props.settings?.is_multiply} />
        case "editor":
            return <ComponentTextEditor article={article} />
        case "file":
            return <ComponentFile article={article} is_multiply={props.settings?.is_multiply} request_object={request_object} object_id={object_id} />
        case "radio":
            return <ComponentRadio
                article={article}
                list={props.list}
                is_disabled={Boolean(is_disabled)}
                hook={hook} />
        case "info_strings":
            return <ComponentInfoStrings article={article} />
        case "smart_list":
            const { properties } = props.settings
            return <ComponentSmartList article={article} properties={properties} hook={hook} />
        case "layout":
            const is_edit = Boolean(props.settings?.is_edit)
            return <ComponentLayout article={article} is_edit={is_edit} />
        default:
            return <ComponentInCreation type={field_type} />
    }
}
//Компонент, состоящий из поля определенного типа и лейбла
const ModuleFormField: React.FC<ModuleFormFieldType> = (props) => {
    const { annotation, title, is_required, article, buttons, size, object_id, request_object } = props
    const currentButtons = buttons.filter(button => button.settings.field_place === article)
    const [{ value: isFieldVisible }] = useField(`fieldsVisibility.${article}`)
    const [{ value: fieldDescription }] = useField(`fieldsDescriptions.${article}`)
    const [{ value: isFieldDisabled }] = useField(`fieldsDisabled.${article}`)
    const resolvedSize = size ? size * 3 : 12
    const resolvedContainerClassName = `moduleForm_field${!isFieldVisible ? " disabled" : ""}${resolvedSize !== 12 ? " marginless" : ""}`
    return <Form.Group className={resolvedContainerClassName} as={Col} md={resolvedSize}>
        {
            title ? <Form.Group className="moduleForm_field_labelContainer" as={Col} md={12}>
                <ComponentTooltip title={title}>
                    <label className={`moduleForm_field_label${is_required ? " required" : ""}`}>{title}</label>
                </ComponentTooltip>
                {annotation ? <ComponentAnnotation annotation={annotation} /> : null}
            </Form.Group> : null
        }
        <Form.Group className="moduleForm_field_container" as={Col} md={12}>
            <div className="moduleForm_field_component"><Component {...props} is_disabled={isFieldDisabled} request_object={request_object} object_id={object_id} /></div>
            {currentButtons.map(button => <ComponentButton
                className="moduleForm_field_button"
                key={button.type + button.settings.title}
                {...button}
                customHandler={() => { }}
                defaultLabel="icon"
            />)}
        </Form.Group>
        <span className="moduleForm_field_description">{fieldDescription ?? ""}</span>
    </Form.Group>
}
//Блок полей 
const ModuleFormBlock: React.FC<ModuleFormBlockType> = ({ title, fields, buttons, object_id, request_object }) => {
    const fieldsArticles = useMemo(() => {
        return fields.map(field => field.article)
    }, [fields])
    const [{ value: visibilityState }] = useField(`fieldsVisibility`)
    const isBlockVisible = fieldsArticles.some(article => visibilityState[article])
    return <div className={`moduleForm_block card ${!isBlockVisible ? "disabled" : ""}`}>
        {
            title ? <div className="moduleForm_block_title card-header">
                <div className="card-title">
                    <h3>
                        {title}
                    </h3>
                </div>
            </div> : null
        }
        <div className="moduleForm_block_fields card-body">
            {fields.map(field => <ModuleFormField key={field.article} {...field} buttons={buttons} request_object={request_object} object_id={object_id} />)}
        </div>

    </div>
}
const getBlockKey = (block: ModuleFormBlockType) => {
    const concatedFieldArticles = block.fields?.reduce((acc, field) => `${acc}-${field.article}`, '')
    return concatedFieldArticles
}
const ModuleFormArea: React.FC<ModuleFormAreaType> = ({ blocks, size, buttons, object_id, request_object }) => {
    return <Form.Group className="moduleForm_area" as={Col} md={size * 3}>
        {blocks.map(block => <ModuleFormBlock key={getBlockKey(block)}  {...block} buttons={buttons} request_object={request_object} object_id={object_id} />)}
    </Form.Group>
}

const getAreaKey = (area: ModuleFormAreaType) => {
    const concatedAreaTitles = area.blocks.reduce((acc, block) => {
        const concatedFieldArticles = block.fields?.reduce((acc, field) => `${acc}-${field.article}`, '')
        return `${acc}-${concatedFieldArticles}`
    }, "")
    return `${area.size}${concatedAreaTitles}`
}

const ModuleForm: React.FC<ModuleFormType> = ({ components, settings }) => {
    //контекст нужен для передачи дополнительных инит значений (прим.: модалка в расписании)
    const modalContext = useContext<any>(ModalContext)
    const initialData = Object.assign({}, modalContext.initialData ?? {}, settings.data ?? {})
    const { object, command, command_type, areas, type } = settings
    const buttons = useMemo(() => Array.isArray(components) ? [] : components.buttons, [components])
    const mainButtons = useMemo(() => buttons.filter(button => !button.settings.field_place), [buttons])
    const fieldButtons = useMemo(() => buttons.filter(button => button.settings.field_place), [buttons])
    const { mutate: classicMutate, isSuccess: isSuccessClassicMutate, isLoading: isClassicMutateLoading, data: responseOnClassicMutate } = useMutate(object, command)
    const { mutate: mutateWithFiles,
        isSuccess: isSuccessMutateWithFiles,
        isLoading: isMutateWithFilesLoading,
        data: responseOnMutateWithFilesData
    } = useMutateWithFiles(object, command)
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const splitedUrl = pathname.slice(1).split("/")
    const id = modalContext.initialData?.id ?? (Number.isInteger(Number(splitedUrl[splitedUrl.length - 1])) ? Number(splitedUrl[splitedUrl.length - 1]) : null)
    const useFormDataRequest = type === "multipart/form-data"
    const isCreating = command_type === "add" || command_type === "custom"
    const mutate = useFormDataRequest ? mutateWithFiles : classicMutate
    const isSuccess = useFormDataRequest ? isSuccessMutateWithFiles : isSuccessClassicMutate
    const isLoading = useFormDataRequest ? isMutateWithFilesLoading : isClassicMutateLoading
    const responseData = useFormDataRequest ? responseOnMutateWithFilesData : responseOnClassicMutate

    /* функция проверяет, есть ли у формы кнопка submit с переданным url для перехода после отправки формы, и, если есть, осуществляет переход.
    Сам переход выполняется в двух случаях: после успешного запроса или при отсутствии изменении в форме редактирования (отправка запроса игнорируется)  */
    const afterSubmitAction = useCallback((buttons: Array<ComponentButtonType>) => {
        //смысла нет разбивать на find и проверку наличия, т.к. ts не определит, что это кнопка типа submit. Переделать в дальнейшем
        //@ts-ignore 
        const redirectUrl = buttons.find(button => button.type === "submit")?.settings?.href ?? ""
        if (redirectUrl && !modalContext.setShow) {
            if (redirectUrl === "[return]") {
                const pathsArray = sessionStorage.getItem("paths") ?? JSON.stringify([])
                const resolvedPathsArray = JSON.parse(pathsArray) as Array<string>
                if (resolvedPathsArray.length) {
                    const currentPath = resolvedPathsArray[resolvedPathsArray.length - 1]
                    navigate(currentPath)
                } else {
                    navigate(pathname.slice(1).split("/")[0])
                }
            } else {
                navigate(`/${redirectUrl}`)
            }
        } else if (modalContext.setShow) {
            modalContext.setShow(false)
        }
    }, [])


    useEffect(() => {
        if (isSuccess) {
            afterSubmitAction(buttons)
            if (modalContext.handleResponse) {
                modalContext.handleResponse(responseData)
            }
        }
    }, [isSuccess])

    const formConfiguration = useMemo(() => {
        const fields = getFields(areas)
        return {
            initialValues: getInitialValues(fields, isCreating, id ? { ...initialData, id } : initialData),
            validationSchema: getValidationSchema(fields)
        }
    }, [areas, initialData])

    const handleSubmit = (formValues: any) => {
        /* избавляемся от состояний отображения полей и описаний в объекте для отправки */
        const values = { ...formValues }
        delete values.fieldsVisibility
        delete values.fieldsDescriptions
        delete values.fieldsDisabled
        if (isLoading) {
            return
        } else {
            if (isCreating) {
                return mutate(values)
            } else {
                let changedValues: any = {}
                for (let key in values) {
                    if ((values[key] !== formConfiguration.initialValues?.[key]) || key === "id") {
                        changedValues[key] = values[key]
                    }
                }
                const valuesKeysAsArray = Object.keys(changedValues)
                if (valuesKeysAsArray.length > 1 || (valuesKeysAsArray.length === 1 && !valuesKeysAsArray.includes("id"))) {
                    mutate(changedValues)
                } else {
                    afterSubmitAction(buttons)
                }
            }
        }
    }

    const isFormInsideModal = Boolean(modalContext.insideModal)
    const buttonsContainerAdditionalClass = isFormInsideModal ? buttons.length === 2 ? "between" : "" : "inverse"
    return <Formik
        enableReinitialize
        initialValues={formConfiguration.initialValues}
        onSubmit={handleSubmit}
        validationSchema={formConfiguration.validationSchema}
    >
        {({ handleSubmit }) => {
            return <div className="moduleForm">
                <FormikForm>
                    <div className="moduleForm_container">
                        {areas.map(area => <ModuleFormArea key={getAreaKey(area)} {...area} buttons={fieldButtons} request_object={object} object_id={id} />)}
                    </div>
                    <Form.Group className={`componentButton_container ${buttonsContainerAdditionalClass}`} as={Col} md={12}>
                        {mainButtons.map(button => <ComponentButton key={button.type + button.settings.title} {...button} customHandler={handleSubmit} />)}
                    </Form.Group>
                </FormikForm>
                <InfoModal />
            </div>
        }}
    </Formik>
}

export default ModuleForm