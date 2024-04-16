import {TApiDatabaseScheme, TApiObjectScheme, TApiPageScheme} from "../../../types/api";
import React from "react";

export type TMultipleEditModal = {show: boolean, setShow: (value: boolean) => void, currentSchemeCommands: Array<string>}

export type TModuleSchemesFieldsSection =  { title?: string, className?: string, children: Array<React.ReactChild | null> | React.ReactChild | null }

export type TModuleSchemesFieldsRow = { children: Array<React.ReactChild | null> | React.ReactChild | null }

export type TModuleSchemesField = { title: string, size: number, children: React.ReactChild, required?: boolean }

export type TModuleSchemesButtonsContainer = { children: Array<React.ReactChild | null> | React.ReactChild | null }

export type TModuleSchemesTab = {
    type: string,
    schemes: any,
    tabs: Array<any>,
    mutate: (values: any) => void,
    deleteScheme: (values: any) => void
}

export type TModuleSchemesCommandsTab = {
    schemes: any,
    mutate: (values: any) => void,
    deleteScheme: (values: any) => void
}

export type TModuleSchemesCommandForm = {
    data: {
        title: string,
        article?: string,
        type: string,
        object_scheme: string,
        modules: Array<string>,
        permissions: Array<string>
    },
    selectedScheme?: string,
    mutate: (values: any) => void,
    deleteScheme?: (values: any) => void
}

export type TModuleSchemesDatabasesTab = TModuleSchemesCommandsTab

export type TModuleSchemesDatabaseForm = {
    data: {
        title: string,
        article?: string,
        properties: TApiDatabaseScheme["properties"]
    },
    selectedScheme?: string,
    mutate: (values: any) => void,
    deleteScheme?: (values: any) => void
}

export type TModuleSchemesDatabasePropertyRow = {
    parentArticle: string,
    rowIndex: number
}

export type TModuleSchemesOblectsTab = TModuleSchemesCommandsTab & {
    tabs: Array<any>
}

export type TModuleSchemesObjectForm = {
    data: {
        title: string,
        article?: string,
        table: string,
        is_trash: boolean,
        properties: TApiObjectScheme["properties"]
    },
    selectedScheme?: string,
    databaseTables: Array<any>,
    currentSchemeCommands: Array<string>,
    mutate: (values: any) => void,
    deleteScheme?: (values: any) => void
}

export type TModuleSchemesObjectPropertyRow = {
    parentArticle: string,
    rowIndex: number,
    databaseTables: Array<any>,
    currentSchemeCommands: Array<string>,
    isLastProperty: boolean
}


export type TModuleSchemesPagesTab = TModuleSchemesCommandsTab

export type TModuleSchemesPageForm = {
    data: {
        section?: string,
        page?: string,
        required_modules: Array<string>,
        required_permissions: Array<string>,
        structure: TApiPageScheme["structure"]
    },
    selectedScheme?: string,
    mutate: (values: any) => void,
    deleteScheme?: (values: any) => void
}

export type TModuleSchemesPageStructureRow = {
    parentArticle: string,
    structure: {
        title: string,
        type: string,
        size: number,
        components: any,
        settings: any
    },
    handleDelete: (structure: any) => void,
    setFieldValue: (article: string, value: any) => void
}