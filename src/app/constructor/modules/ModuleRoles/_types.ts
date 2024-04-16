import { TApiNotificationTypes, TApiPermission, TApiRole } from "../../../types/api"
import { TDefaultModule } from "../_types";

export type TModuleRolesPermissionCheckbox = {
    article: string,
    id: number,
    title: string,
    description?: string
}
export type TModuleRolesPermissionRow = TApiPermission
export type TModuleRolesAdministrationAccess = { permissions_groups: Array<TModuleRolesPermissionRow> }
export type TModuleRolesPermissionTable = {
    permissions: Array<TModuleRolesPermissionRow>
}

export type TModuleRolesNotificationCheckbox = {
    article: string,
    id: number,
    title: string,
    description?: string
}
export type TModuleRolesNotificationTable = {
    notifications: TApiNotificationTypes
}

export type TModuleRolesDetailsModal = {
    chosenRole: TApiRole | null,
    setRole: (clearValue: null) => void,
    refetchRoles: () => void
}
export type TModuleRolesCard = TApiRole & {
    setRole: (role: TApiRole) => void,
    handleRemoveRoleClick: (id: number) => void
}
export type TModuleRoles = TDefaultModule<"roles", Array<any>, Array<any>>