import {IntlShape} from "react-intl";
import React from "react";
import {TDefaultModule} from "../../../types/modules";
import {TModuleFormField} from "../ModuleForm/_types";

export type TResolvedVariable = {title: string, variable: string}

export type TResolvedTableVariables = Array<{title: string, name?: string, variables: Array<TResolvedVariable>}>

export type TDefaultVariable = { title: string, field_type: string }

export type TExtendedVariable = TDefaultVariable & { inner_variables?: { [key: string]: TDefaultVariable } }

export type TVariablesObject = {
    title: string,
    variables: {
        [key: string]: TExtendedVariable
    }
}

export type TModuleDocumentsButtons = {
    intl: IntlShape,
    isSubpage: boolean,
    document_body: string,
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void,
    handlePrintContent: (content: string) => void
}

export type TModuleDocuments = TDefaultModule<"documents", Array<any>, {
    command: string,
    object: string,
    data: any
    fields_list?: Array<TModuleFormField>
}>