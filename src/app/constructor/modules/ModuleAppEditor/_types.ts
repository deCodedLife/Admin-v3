import { TDefaultModule } from "../_types"
import React from "react";

export type TModuleAppEditorHandleDropItem = { type: "field", areaIndex: number, blockIndex: number, source: any } |
    { type: "block", areaIndex: number, source: any } |
    { type: "area", source: any }

export type TModuleAppEditorField = {
    type: "system" | "custom",
    title: string,
    field_type?: string,
    article: string
}

type TModuleAppEditorBlock = {
    type: "system" | "custom",
    fields?: Array<TModuleAppEditorField>
}

type TModuleAppEditorArea = {
    type: "system" | "custom",
    size: number,
    blocks?: Array<TModuleAppEditorBlock>
}

export type TModuleAppEditorFieldData = {
    areaIndex: number,
    blockIndex: number,
    fieldIndex?: number,
    field?: TModuleAppEditorField
} | null

export type TModuleAppEditorDraggableItem = { type: "field", areaIndex: number, blockIndex: number, source: any } | { type: "block", areaIndex: number, source: any } |
    { type: "area", areaIndex: number, source: any } | null

export type TModuleAppEditorComponentField = {
    field: TModuleAppEditorField,
    draggableItem: { type: "field" | "block" | "area" } | null
    handleEdit: () => void,
    onDrag: () => void,
    onDrop: () => void
}

export type TModuleAppEditorComponentBlock = {
    block: TModuleAppEditorBlock,
    blockIndex: number,
    areaIndex: number,
    draggableItem: TModuleAppEditorDraggableItem,
    setDraggableItem: React.Dispatch<React.SetStateAction<TModuleAppEditorDraggableItem>>,
    setFieldData: React.Dispatch<React.SetStateAction<TModuleAppEditorFieldData>>,
    onDrop: (item: TModuleAppEditorHandleDropItem) => void,
    handleDeleteBlock: (areaIndex: number, blockIndex: number) => void,
}

export type TModuleAppEditorComponentArea = {
    area: TModuleAppEditorArea,
    areaIndex: number,
    selectedScheme: string,
    draggableItem: TModuleAppEditorDraggableItem,
    setDraggableItem: React.Dispatch<React.SetStateAction<TModuleAppEditorDraggableItem>>,
    setFieldData: React.Dispatch<React.SetStateAction<TModuleAppEditorFieldData>>,
    onDrop: (item: TModuleAppEditorHandleDropItem) => void,
    handleAppendBlock: (areaIndex: number) => void,
    handleDeleteBlock: (areaIndex: number, blockIndex: number) => void,
    handleDeleteArea: (areaIndex: number) => void
}

export type TModuleAppEditorFieldModal = {
    fieldData: TModuleAppEditorFieldData,
    setFieldData: React.Dispatch<React.SetStateAction<TModuleAppEditorFieldData>>,
    handleSubmitField: (field: TModuleAppEditorField) => void,
    handleDeleteField: (areaIndex: number, blockIndex: number, fieldIndex: number) => void
}

export type TModuleAppEditorSchemeModal = {
    showSchemeModal: boolean,
    setShowSchemeModal: (state: boolean) => void,
    handleAppendScheme: (schemeValues: { title: string, article: string }) => void
}

export type TModuleAppEditorScheme = {
    scheme?: {
        title?: string,
        type: "system" | "custom",
        form: Array<TModuleAppEditorArea>
    },
    selectedScheme: string
}

export type TModuleAppEditor = TDefaultModule<"app_editor", Array<any>>