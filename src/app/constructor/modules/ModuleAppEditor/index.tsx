import { Formik, Form as FormikForm, useFormikContext } from "formik"
import React, { useMemo, useState } from "react"
import { Col, Form, Modal } from "react-bootstrap"
import useRequest from "../../../api/hooks/useRequest"
import ComponentButton from "../../components/ComponentButton"
import ComponentInput from "../../components/ComponentInput"
import ComponentSelect from "../../components/ComponentSelect"
import * as Yup from 'yup';
import useMutate from "../../../api/hooks/useMutate"
import { useIntl } from "react-intl"
import setModalIndex from "../../helpers/setModalIndex"
import {
    TModuleAppEditor,
    TModuleAppEditorComponentArea,
    TModuleAppEditorComponentBlock,
    TModuleAppEditorComponentField,
    TModuleAppEditorDraggableItem,
    TModuleAppEditorField, TModuleAppEditorFieldData,
    TModuleAppEditorFieldModal,
    TModuleAppEditorHandleDropItem,
    TModuleAppEditorScheme,
    TModuleAppEditorSchemeModal
} from "./_types";

const fieldTypesList = [
    { title: "Строка", value: "string" },
    { title: "Текстовое поле", value: "textarea" },
    { title: "Целое число", value: "integer" },
    { title: "Число с плавающей точкой", value: "float" }
]
const areaSizesList = [
    { title: "1", value: 1 },
    { title: "2", value: 2 },
    { title: "3", value: 3 },
    { title: "4", value: 4 }
]
const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault()

const Field: React.FC<TModuleAppEditorComponentField> = props => {
    const { field, draggableItem, handleEdit, onDrag, onDrop } = props
    const intl = useIntl()
    const isFieldDraggable = field.type === "custom"
    const handleDrag = () => isFieldDraggable ? onDrag() : null
    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => draggableItem?.type === "field" ? event.currentTarget.classList.add("overField") : null
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => draggableItem?.type === "field" && !event.currentTarget.contains(event.relatedTarget as Node | null) ?
        event.currentTarget.classList.remove("overField") : null

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        onDrop()
        event.currentTarget.classList.remove("overField")
    }
    return <Form.Group
        className="moduleAppEditor_schemeField"
        as={Col} md={12}
        draggable={isFieldDraggable}
        onDrag={handleDrag}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
        <span className="moduleAppEditor_schemeFieldLabel">{field.title}</span>
        <div className="moduleAppEditor_schemeFieldValue"></div>
        <ComponentButton
            type="custom"
            settings={{ title: intl.formatMessage({ id: "APP_EDITOR.EDIT_FIELD_BUTTON" }), icon: "gear", background: "dark" }}
            defaultLabel="icon"
            disabled={field.type === "system"}
            customHandler={handleEdit}
        />
    </Form.Group>
}
const Block: React.FC<TModuleAppEditorComponentBlock> = props => {
    const {
        block,
        blockIndex,
        areaIndex,
        draggableItem,
        setDraggableItem,
        setFieldData,
        onDrop, handleDeleteBlock
    } = props
    const intl = useIntl()
    const isBlockDraggable = block.type === "custom"
    const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
        return isBlockDraggable && (event.target instanceof Element && !event.target.closest(".moduleAppEditor_schemeField")) ?
            setDraggableItem(prev => prev?.source === block ? prev : { type: "block", areaIndex, source: block }) : null
    }
    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        switch (draggableItem?.type) {
            case "field":
                return (event.target instanceof Element && !event.target.closest(".moduleAppEditor_schemeField")) ? event.currentTarget.classList.add("fieldOverBlock") : null
            case "block":
                return event.currentTarget.classList.add("blockOverBlock")
        }
    }
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        switch (draggableItem?.type) {
            case "field":
                return (event.currentTarget.contains(event.relatedTarget as Node | null) &&
                    (event.relatedTarget instanceof Element && !event.relatedTarget?.closest(".moduleAppEditor_schemeField"))) ?
                    null : event.currentTarget.classList.remove("fieldOverBlock")
            case "block":
                return event.currentTarget.contains(event.relatedTarget as Node | null) ? null : event.currentTarget.classList.remove("blockOverBlock")
        }
    }
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        switch (draggableItem?.type) {
            case "field":
                if (event.target instanceof Element && !event.target.closest(".moduleAppEditor_schemeField")) {
                    onDrop({ type: "block", areaIndex, source: block })
                }
                break
            case "block":
                onDrop({ type: "block", areaIndex, source: block })
                break
        }
        return event.currentTarget.classList.remove("fieldOverBlock", "blockOverBlock")
    }
    return <Form.Group
        draggable={isBlockDraggable}
        className="moduleAppEditor_schemeBlock"
        as={Col}
        md={12}
        onDrag={handleDrag}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
        <div className="moduleAppEditor_schemeBlockCard">
            {block.fields?.map((field, fieldIndex) => <Field
                field={field}
                draggableItem={draggableItem}
                handleEdit={() => setFieldData({ areaIndex, blockIndex, fieldIndex, field })}
                onDrag={() => setDraggableItem(prev => prev?.source === field ? prev : { type: "field", areaIndex, blockIndex, source: field })}
                onDrop={() => onDrop({ type: "field", areaIndex, blockIndex, source: field })}
            />)}
            <div className="moduleAppEditor_schemeBlockButtons">
                <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: "APP_EDITOR.APPEND_FIELD_BUTTON" }), icon: "", background: "dark" }}
                    customHandler={() => setFieldData({ areaIndex, blockIndex })}
                />
                {block.type === "custom" ? <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: "APP_EDITOR.DELETE_BLOCK_BUTTON" }), icon: "", background: "danger", attention_modal: true }}
                    customHandler={() => handleDeleteBlock(areaIndex, blockIndex)} /> : null}
            </div>
        </div>
    </Form.Group>
}
const Area: React.FC<TModuleAppEditorComponentArea> = props => {
    const {
        area,
        areaIndex,
        selectedScheme,
        draggableItem,
        setDraggableItem,
        setFieldData,
        onDrop, handleAppendBlock, handleDeleteBlock, handleDeleteArea
    } = props
    const intl = useIntl()
    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        switch (draggableItem?.type) {
            case "block":
                return (event.target instanceof Element && event.target.closest(".moduleAppEditor_schemeBlock")) ? null : event.currentTarget.classList.add("blockOverArea")
        }

    }
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        switch (draggableItem?.type) {
            case "block":
                return (event.currentTarget.contains(event.relatedTarget as Node | null) &&
                (event.relatedTarget instanceof Element && !event.relatedTarget?.closest(".moduleAppEditor_schemeBlock"))) ?
                    null : event.currentTarget.classList.remove("blockOverArea")
        }
    }
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        switch (draggableItem?.type) {
            case "block":
                if (event.target instanceof Element && event.target.closest(".moduleAppEditor_schemeBlock")) {
                    onDrop({ type: "area", source: area })
                }
        }
        return event.currentTarget.classList.remove("blockOverArea")
    }

    return <Form.Group
        className="moduleAppEditor_schemeArea"
        as={Col}
        md={3 * area.size}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
        <div className="moduleAppEditor_schemeAreaBlocks">
            {area.blocks?.map?.((block, blockIndex) => <Block
                block={block}
                blockIndex={blockIndex}
                areaIndex={areaIndex}
                draggableItem={draggableItem}
                setDraggableItem={setDraggableItem}
                setFieldData={setFieldData}
                onDrop={onDrop}
                handleDeleteBlock={handleDeleteBlock}
            />)}
        </div>
        <div className="moduleAppEditor_schemeAreaToolbar">
            <div className="moduleAppEditor_schemeAreaButtons">
                <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: "APP_EDITOR.APPEND_BLOCK_BUTTON" }), icon: "", background: "dark" }}
                    customHandler={() => handleAppendBlock(areaIndex)}
                />
                {area.type === "custom" ? <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: "APP_EDITOR.DELETE_AREA_BUTTON" }), icon: "", background: "danger", attention_modal: true }}
                    customHandler={() => handleDeleteArea(areaIndex)} /> : null}
            </div>
            <div className="moduleAppEditor_schemeAreaSizeContainer">
                <label>Размер области:</label>
                <ComponentSelect article={`schemes[${selectedScheme}].form[${areaIndex}].size`} data_type="integer" list={areaSizesList} />
            </div>

        </div>
    </Form.Group>
}

const FieldModal: React.FC<TModuleAppEditorFieldModal> = ({ fieldData, setFieldData, handleSubmitField, handleDeleteField }) => {
    const intl = useIntl()
    const validationSchema = Yup.object().shape({
        article: Yup.string().matches(/^[A-Za-z_]+$/, intl.formatMessage({ id: "APP_EDITOR.ARTICLE_VALIDATION_SYMBOLS" })).min(4, intl.formatMessage({ id: "APP_EDITOR.ARTICLE_VALIDATION_LENGTH" })).required(" "),
        title: Yup.string().required(" "),
        field_type: Yup.string().required(" ")
    })

    return <Modal show={Boolean(fieldData)} onHide={() => setFieldData(null)} onEntering={setModalIndex} >
        <Modal.Header>
            <Modal.Title>
                {`${intl.formatMessage({ id: fieldData?.field ? "APP_EDITOR.FIELD_MODAL_EDIT_TITLE" : "APP_EDITOR.FIELD_MODAL_APPEND_TITLE" })}`}
            </Modal.Title>
        </Modal.Header>
        <Formik
            initialValues={fieldData?.field ? fieldData.field : { type: "custom" as "custom", title: "", article: "", field_type: "" }}
            validationSchema={validationSchema}
            onSubmit={values => handleSubmitField(values)}>
            {({ handleSubmit }) => <FormikForm>
                <Modal.Body>
                    <Form.Group as={Col} md={12}>
                        <label className="required">{intl.formatMessage({ id: "APP_EDITOR.FIELD_MODAL_TITLE_LABEL" })}</label>
                        <ComponentInput article="title" field_type="string" />
                    </Form.Group>
                    {
                        !fieldData?.field ? <Form.Group as={Col} md={12}>
                            <label className="required">{intl.formatMessage({ id: "APP_EDITOR.FIELD_MODAL_ARTICLE_LABEL" })}</label>
                            <ComponentInput article="article" field_type="string" />
                        </Form.Group> : null
                    }
                    <Form.Group as={Col} md={12}>
                        <label className="required">{intl.formatMessage({ id: "APP_EDITOR.FIELD_MODAL_TYPE_LABEL" })}</label>
                        <ComponentSelect article="field_type" data_type="string" list={fieldTypesList} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    {typeof fieldData?.fieldIndex === "number" ?
                        <ComponentButton
                            type="custom"
                            settings={{ title: intl.formatMessage({ id: "APP_EDITOR.DELETE_FIELD_BUTTON" }), icon: "", background: "danger", attention_modal: true }}
                            customHandler={() => {
                                handleDeleteField(fieldData.areaIndex, fieldData.blockIndex, fieldData.fieldIndex as number)
                                setFieldData(null)
                            }} /> : null}
                    <ComponentButton
                        type="custom"
                        settings={{ title: intl.formatMessage({ id: fieldData?.field ? "BUTTON.EDIT" : "BUTTON.APPEND" }), icon: "", background: "dark" }}
                        customHandler={handleSubmit} />
                </Modal.Footer>
            </FormikForm>}
        </Formik>
    </Modal>
}
const SchemeModal: React.FC<TModuleAppEditorSchemeModal> = ({ showSchemeModal, setShowSchemeModal, handleAppendScheme }) => {
    const intl = useIntl()
    const validationSchema = Yup.object().shape({
        title: Yup.string().required(" "),
        article: Yup.string().matches(/^[A-Za-z_]+$/, intl.formatMessage({ id: "APP_EDITOR.ARTICLE_VALIDATION_SYMBOLS" })).min(4, intl.formatMessage({ id: "APP_EDITOR.ARTICLE_VALIDATION_LENGTH" })).required(" "),
    })
    return <Modal show={showSchemeModal} onHide={() => setShowSchemeModal(false)} onEntering={setModalIndex}>
        <Modal.Header>
            <Modal.Title>
                {intl.formatMessage({ id: "APP_EDITOR.SCHEME_MODAL_TITLE" })}
            </Modal.Title>
        </Modal.Header>
        <Formik initialValues={{ title: "", article: "" }} validationSchema={validationSchema} onSubmit={handleAppendScheme}>
            {({ handleSubmit }) => <FormikForm>
                <Modal.Body>
                    <Form.Group as={Col} md={12}>
                        {intl.formatMessage({ id: "APP_EDITOR.SCHEME_MODAL_TITLE_LABEL" })}
                        <ComponentInput article="title" field_type="string" />
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                        {intl.formatMessage({ id: "APP_EDITOR.SCHEME_MODAL_ARTICLE_LABEL" })}
                        <ComponentInput article="article" field_type="string" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <ComponentButton type="custom" settings={{ title: intl.formatMessage({ id: "BUTTON.APPEND" }), icon: "", background: "dark" }} customHandler={handleSubmit} />
                </Modal.Footer>
            </FormikForm>}
        </Formik>

    </Modal>
}

const Scheme: React.FC<TModuleAppEditorScheme> = ({ scheme, selectedScheme }) => {
    const intl = useIntl()
    const [draggableItem, setDraggableItem] = useState<TModuleAppEditorDraggableItem>(null)
    const { values, setFieldValue } = useFormikContext<any>()
    const [fieldData, setFieldData] = useState<TModuleAppEditorFieldData>(null)
    const handleAppendArea = () => {
        const schemesClone = { ...values.schemes }
        const schemeClone = { ...scheme }
        schemeClone.form?.push({
            type: "custom",
            size: 2,
            blocks: []
        })
        schemesClone[selectedScheme] = schemeClone
        setFieldValue("schemes", schemesClone)
    }
    const handleDeleteArea = (areaIndex: number) => {
        const schemesClone = { ...values.schemes }
        const schemeClone = { ...scheme }
        schemeClone.form?.splice(areaIndex, 1)
        schemesClone[selectedScheme] = schemeClone
        setFieldValue("schemes", schemesClone)

    }
    const handleAppendBlock = (areaIndex: number) => {
        const schemesClone = { ...values.schemes }
        const schemeClone = { ...scheme }
        schemeClone.form?.[areaIndex].blocks?.push({
            type: "custom",
            fields: []
        })
        schemesClone[selectedScheme] = schemeClone
        setFieldValue("schemes", schemesClone)
    }
    const handleDeleteBlock = (areaIndex: number, blockIndex: number) => {
        const schemesClone = { ...values.schemes }
        const schemeClone = { ...scheme }
        schemeClone.form?.[areaIndex].blocks?.splice(blockIndex, 1)
        schemesClone[selectedScheme] = schemeClone
        setFieldValue("schemes", schemesClone)
    }
    const handleDeleteField = (areaIndex: number, blockIndex: number, fieldIndex: number) => {
        const schemesClone = { ...values.schemes }
        const schemeClone = { ...scheme }
        schemeClone.form?.[areaIndex].blocks?.[blockIndex].fields?.splice(fieldIndex, 1)
        schemesClone[selectedScheme] = schemeClone
        setFieldValue("schemes", schemesClone)
    }
    const handleSubmitField = (field: TModuleAppEditorField) => {
        if (fieldData) {
            const { areaIndex, blockIndex, fieldIndex } = fieldData
            const schemesClone = { ...values.schemes }
            const schemeClone = { ...scheme }
            if (typeof fieldIndex === "number") {
                schemeClone.form?.[areaIndex].blocks?.[blockIndex].fields?.splice(fieldIndex, 1, { ...field })
            } else {
                schemeClone.form?.[areaIndex].blocks?.[blockIndex].fields?.push(field)
            }
            schemesClone[selectedScheme] = schemeClone
            setFieldValue("schemes", schemesClone)
            setFieldData(null)
        }


    }
    const handleDrop = (item: TModuleAppEditorHandleDropItem) => {

        if (draggableItem && (draggableItem.source !== item.source)) {
            const schemesClone = { ...values.schemes }
            const schemeClone = { ...scheme }
            switch (draggableItem.type) {
                case "field":
                    const draggableItemField = schemeClone.form?.[draggableItem.areaIndex].blocks?.[draggableItem.blockIndex].fields?.indexOf(draggableItem.source)
                    switch (item.type) {
                        case "field":
                            schemeClone.form?.[draggableItem.areaIndex].blocks?.[draggableItem.blockIndex].fields?.splice(draggableItemField as number, 1)
                            const currentFieldIndex = schemeClone.form?.[item.areaIndex]?.blocks?.[item.blockIndex].fields?.indexOf(item.source)
                            schemeClone.form?.[item.areaIndex]?.blocks?.[item.blockIndex].fields?.splice(currentFieldIndex as number, 0, draggableItem.source)
                            schemesClone[selectedScheme] = schemeClone
                            setFieldValue("schemes", schemesClone)
                            break
                        case "block":
                            schemeClone.form?.[draggableItem.areaIndex].blocks?.[draggableItem.blockIndex].fields?.splice(draggableItemField as number, 1)
                            const currentBlockIndex = schemeClone.form?.[item.areaIndex].blocks?.indexOf(item.source)
                            schemeClone.form?.[item.areaIndex].blocks?.[currentBlockIndex as number].fields?.push(draggableItem.source)
                            schemesClone[selectedScheme] = schemeClone
                            setFieldValue("schemes", schemesClone)
                            break
                    }
                    break
                case "block":
                    const draggableBlockIndex = schemeClone.form?.[draggableItem.areaIndex].blocks?.indexOf(draggableItem.source)
                    switch (item.type) {
                        case "block":
                            schemeClone.form?.[draggableItem.areaIndex].blocks?.splice(draggableBlockIndex as number, 1)
                            const currentBlockIndex = schemeClone.form?.[item.areaIndex].blocks?.indexOf(item.source)
                            schemeClone.form?.[item.areaIndex].blocks?.splice(currentBlockIndex as number, 0, draggableItem.source)
                            schemesClone[selectedScheme] = schemeClone
                            setFieldValue("schemes", schemesClone)
                            break
                        case "area":
                            schemeClone.form?.[draggableItem.areaIndex].blocks?.splice(draggableBlockIndex as number, 1)
                            const currentAreaIndex = schemeClone.form?.indexOf(item.source)
                            schemeClone.form?.[currentAreaIndex as number].blocks?.push(draggableItem.source)
                            schemesClone[selectedScheme] = schemeClone
                            setFieldValue("schemes", schemesClone)
                            break
                    }
                    break
            }
        }
        return setDraggableItem(null)
    }

    return <div className="moduleAppEditor_schemeContainer">
        {scheme ? scheme.form.map((area, areaIndex) => <Area
            area={area}
            areaIndex={areaIndex}
            selectedScheme={selectedScheme}
            draggableItem={draggableItem}
            setDraggableItem={setDraggableItem}
            setFieldData={setFieldData}
            handleAppendBlock={handleAppendBlock}
            handleDeleteBlock={handleDeleteBlock}
            handleDeleteArea={handleDeleteArea}
            onDrop={handleDrop}
        />) : null}
        <FieldModal fieldData={fieldData} setFieldData={setFieldData} handleSubmitField={handleSubmitField} handleDeleteField={handleDeleteField} />
        {scheme ? <div className="moduleAppEditor_appendAreaButtonContainer">
            <ComponentButton
                type="custom"
                settings={{ title: intl.formatMessage({ id: "APP_EDITOR.APPEND_AREA_BUTTON" }), icon: "", background: "dark" }}
                customHandler={() => handleAppendArea()}
            />
        </div> : null}

    </div>
}

const ModuleAppEditor: React.FC<TModuleAppEditor> = props => {
    const intl = useIntl()
    const [newScheme, setNewScheme] = useState<{ title: string, article: string } | null>(null)
    const [showSchemeModal, setShowSchemeModal] = useState(false)
    const { data: schemes } = useRequest("admin", "get-user-schemes", {})
    const { mutate } = useMutate("admin", "update-user-scheme")
    const schemesList = useMemo(() => {
        const listFromSchemes = schemes ? Object.entries<{ title: string }>(schemes).map(([article, { title }]) => ({ title: title ?? article, value: article })) : []
        if (newScheme) {
            listFromSchemes.push({ title: newScheme.title, value: newScheme.article })
        }
        return listFromSchemes
    }, [schemes, newScheme])
    const initialValues = useMemo(() => ({
        selectedScheme: "",
        schemes: schemes ?? {}
    }), [schemes])

    return <div className="moduleAppEditor">
        <Formik enableReinitialize initialValues={initialValues} onSubmit={values => mutate({ scheme_body: JSON.stringify(values.schemes) })}>
            {({ handleSubmit, values, setFieldValue }) => {
                const handleAppendScheme = (schemeValues: { title: string, article: string }) => {
                    setNewScheme({ title: schemeValues.title, article: schemeValues.article })
                    const schemesClone = { ...values.schemes }
                    schemesClone[schemeValues.article] = { title: schemeValues.title, type: "custom", form: [] }
                    setFieldValue("schemes", schemesClone)
                    setFieldValue("selectedScheme", schemeValues.article)
                    setShowSchemeModal(false)
                }
                return <FormikForm>
                    <div className="moduleAppEditor_toolbar">
                        <div className="moduleAppEditor_schemeSelector">
                            <ComponentSelect
                                article="selectedScheme"
                                data_type="string"
                                list={schemesList}
                                placeholder={intl.formatMessage({ id: "APP_EDITOR.SELECT_SCHEME_PLACEHOLDER" })}
                            />
                        </div>
                        <div className="moduleAppEditor_buttonsContainer">
                            <ComponentButton
                                type="submit"
                                settings={{ title: intl.formatMessage({ id: "APP_EDITOR.APPEND_SCHEME_BUTTON" }), icon: "", background: "dark" }}
                                customHandler={() => setShowSchemeModal(true)}
                            />
                            <ComponentButton
                                type="submit"
                                settings={{ title: intl.formatMessage({ id: "APP_EDITOR.SAVE_BUTTON" }), icon: "", background: "dark" }}
                                customHandler={handleSubmit}
                            />
                        </div>
                    </div>
                    <Scheme scheme={values.schemes?.[values.selectedScheme]} selectedScheme={values.selectedScheme} />
                    <SchemeModal showSchemeModal={showSchemeModal} setShowSchemeModal={setShowSchemeModal} handleAppendScheme={handleAppendScheme} />
                </FormikForm>
            }}
        </Formik>


    </div>
}

export default ModuleAppEditor