import { Formik, Form as FormikForm, useFormikContext } from "formik"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Col, Form, Modal } from "react-bootstrap"
import useItem from "../../api/hooks/useItem"
import useMutate from "../../api/hooks/useMutate"
import { ApiNotificationTypesType, ApiRoleType } from "../../types/api"
import {
    ModuleRolesAdministrationAccessType, ModuleRolesCardType, ModuleRolesDetailsModalType,
    ModuleRolesNotificationCheckboxType, ModuleRolesNotificationTableType, ModuleRolesPermissionCheckboxType, ModuleRolesPermissionRowType,
    ModuleRolesPermissionTableType, ModuleRolesType
} from "../../types/modules"
import ComponentButton from "../components/ComponentButton"
import ComponentCheckbox from "../components/ComponentCheckbox"
import ComponentInput from "../components/ComponentInput"
import SplashScreen from "../helpers/SplashScreen"
import { useIntl } from "react-intl"
import setModalIndex from "../helpers/setModalIndex"


const PermissionCheckbox: React.FC<ModuleRolesPermissionCheckboxType> = ({ article, id, title, description }) => {
    const { values, setFieldValue } = useFormikContext<any>()

    const isChecked = values.permissions.includes(id)

    const handleChange = () => {
        const permissions = [...values.permissions]
        if (isChecked) {
            const index = permissions.findIndex(item => item === id)
            permissions.splice(index, 1)
        } else {
            permissions.push(id)
        }
        setFieldValue("permissions", permissions)
    }

    return <div className="moduleRoles_permission">
        <ComponentCheckbox article={article} customChecked={isChecked} customHandler={handleChange} description={description} label={title} />
    </div>
}

const AdministrationAccessCheckbox: React.FC<ModuleRolesAdministrationAccessType> = ({ permissions_groups }) => {
    const intl = useIntl()
    const { values, setFieldValue } = useFormikContext<any>()
    //делаем выжимку значений (id) всех доступов 
    const allPermissionsValues = useMemo(() => {
        return permissions_groups.reduce<Array<number>>((acc, group) => acc.concat(group.permissions.map(item => item.id)), [])
    }, [permissions_groups])

    const isChecked = allPermissionsValues.every(permission => values.permissions.includes(permission))

    const handleChange = () => {
        if (isChecked) {
            setFieldValue("permissions", [])
        } else {
            setFieldValue("permissions", [...allPermissionsValues])
        }
    }

    return <tr>
        <td className="text-gray-800">{intl.formatMessage({ id: "ROLES.ADMINISTRATIVE_ACCESS" })}</td>
        <td>
            <div className="d-flex">
                <ComponentCheckbox
                 article="administationAccess" 
                 customChecked={isChecked} 
                 customHandler={handleChange} 
                 label={intl.formatMessage({ id: "ROLES.ADMINISTRATIVE_ACCESS_LABEL" })}
                  />

            </div>
        </td>
    </tr>
}

const PermissionRow: React.FC<ModuleRolesPermissionRowType> = ({ group_title, permissions }) => {
    return <tr>
        <td className="text-gray-800">{group_title}</td>
        <td>
            <div className="d-flex flex-wrap">
                {permissions.map(permission => {
                    return <PermissionCheckbox
                        key={permission.id}
                        article={permission.article}
                        id={permission.id}
                        title={permission.title}
                        description={permission.description}
                    />
                })}
            </div>
        </td>
    </tr>
}
const PermissionsTable: React.FC<ModuleRolesPermissionTableType> = ({ permissions }) => {
    const intl = useIntl()
    return <div className="fv-row">
        <label className="moduleRoles_field_label">{intl.formatMessage({ id: "ROLES.PERMISSIONS" })}</label>
        <div className="table-responsive">
            <table className="table align-middle table-row-dashed fs-6 gy-5">
                <tbody className="text-gray-600 fw-semibold">
                    <AdministrationAccessCheckbox permissions_groups={permissions} />
                    {permissions?.map(permission => <PermissionRow key={permission.group_id} {...permission} />)}
                </tbody>
            </table>
        </div>
    </div>
}


const NotificationCheckbox: React.FC<ModuleRolesNotificationCheckboxType> = ({ article, id, title, description }) => {
    const { values, setFieldValue } = useFormikContext<any>()

    const isChecked = values.notificationTypes.includes(id)

    const handleChange = () => {
        const notifications = [...values.notificationTypes]
        if (isChecked) {
            const index = notifications.findIndex(item => item === id)
            notifications.splice(index, 1)
        } else {
            notifications.push(id)
        }
        setFieldValue("notificationTypes", notifications)
    }

    return <tr>
        <td>
            <ComponentCheckbox article={article} customChecked={isChecked} customHandler={handleChange} label={title} description={description} />
        </td>
    </tr>
}

const NotificationsTable: React.FC<ModuleRolesNotificationTableType> = ({ notifications }) => {
    const intl = useIntl()
    return <div className="fv-row">
        <label className="moduleRoles_field_label">{intl.formatMessage({ id: "ROLES.NOTIFICATIONS" })}</label>
        <div className="table-responsive">
            <table className="table align-middle table-row-dashed fs-6 gy-5">
                <tbody className="text-gray-600 fw-semibold">
                    {notifications.map((notification) => <NotificationCheckbox key={notification.id}
                        article={notification.article} id={notification.id} title={notification.title} description={notification.description} />)}
                </tbody>
            </table>
        </div>
    </div>
}


const RoleDetailsModal: React.FC<ModuleRolesDetailsModalType> = ({ chosenRole, setRole, refetchRoles }) => {
    const intl = useIntl()
    const { data: permissions } = useItem("permissions", {})

    const { data: notifications } = useItem<ApiNotificationTypesType>("notificationTypes", {})
    const initialValues = useMemo(() => {
        return chosenRole ? {
            id: chosenRole.id,
            title: chosenRole.title,
            permissions: chosenRole.permissions.map(permission => permission.value),
            notificationTypes: chosenRole.notificationTypes?.map(notification => notification.value) ?? []
        } : {}
    }, [chosenRole])

    const { mutate, isSuccess } = useMutate<typeof initialValues>("roles", "update")

    useEffect(() => {
        if (isSuccess) {
            setRole(null)
            refetchRoles()
        }
    }, [isSuccess])
    return <Modal
        size="xl"
        show={Boolean(chosenRole)}
        onHide={() => setRole(null)}
        onEntering={setModalIndex}
    >
        <Modal.Header closeButton>
            <Modal.Title>
                {intl.formatMessage({ id: "MODAL.EDIT_TITLE" })}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className="scroll-y mx-5 my-7">
            <Formik initialValues={initialValues} onSubmit={values => mutate(values)}>
                {({ handleSubmit }) => {
                    return <FormikForm>
                        <div className="moduleRoles_field">
                            <label className="moduleRoles_field_label required">{intl.formatMessage({ id: "ROLES.ROLE_TITLE_LABEL" })}</label>
                            <ComponentInput article="title" field_type="string" />
                        </div>

                        {permissions ? <PermissionsTable permissions={permissions} /> : null}
                        {notifications ? <NotificationsTable notifications={notifications} /> : null}
                        
                        <div className="moduleRoles_buttonsContainer">
                            <ComponentButton
                                type="custom"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.CANCEL" }), background: "light", icon: "" }}
                                customHandler={() => setRole(null)}
                            />
                            <ComponentButton
                                type="submit"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.SAVE" }), background: "dark", icon: "" }}
                                customHandler={handleSubmit}
                            />
                        </div>
                    </FormikForm>
                }}
            </Formik>
        </Modal.Body>
    </Modal>
}


const RoleCard: React.FC<ModuleRolesCardType> = ({ title, permissions, notificationTypes, article, setRole, handleRemoveRoleClick, id }) => {
    const intl = useIntl()
    /* Устанавливается значение доступов в превью под отображение, остаточное количество доступов используется для вывода текста с многоточием */
    const previewedPermissionsCount = 6
    const previewedPermissions = permissions.length > previewedPermissionsCount ? permissions.slice(0, previewedPermissionsCount) : permissions
    const showEllepsis = previewedPermissions.length !== permissions.length
    const afterEllepsisPermissionsCount = showEllepsis ? permissions.length - previewedPermissions.length : 0

    return <Form.Group className="moduleRoles_cardContainer" as={Col} md={4}>
        <div className="card card-flush moduleRoles_card">
            <div className="card-header">
                <div className="card-title"><h2>{title}</h2></div>
            </div>
            <div className="card-body pt-1">
                <div className="d-flex flex-column text-gray-600">
                    {previewedPermissions.map(({ title, value }) => <div key={value} className="d-flex align-items-center py-2">
                        <span className="bullet bg-primary me-3"></span>{title}</div>)}
                    {showEllepsis ? <div className="d-flex align-items-center py-2">
                        <span className="bullet bg-primary me-3"></span>
                        <em>{intl.formatMessage({ id: "ROLES.AND_MORE" })} {afterEllepsisPermissionsCount}...</em>
                    </div> : null}
                </div>
            </div>
            <div className="card-footer flex-wrap pt-0">
                <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: "ROLES.EDIT_BUTTON" }), background: "dark", icon: "" }}
                    customHandler={() => setRole({
                        title,
                        id,
                        article,
                        permissions,
                        notificationTypes
                    })} />
                    <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: "ROLES.DELETE_BUTTON" }), background: "danger", icon: "", attention_modal: true }}
                    customHandler={() => handleRemoveRoleClick(id)}
                    />
            </div>
        </div>
    </Form.Group>
}

const ModuleRoles: React.FC<ModuleRolesType> = () => {
    const { data, isLoading, refetch } = useItem<Array<ApiRoleType>>("roles", {})
    const [chosenRole, setRole] = useState<ApiRoleType | null>(null)
    const { mutate: removeRole, isSuccess: isRemoveRoleSuccess } = useMutate<{id: number}>("roles", "remove")

    useEffect(() => {
        if (isRemoveRoleSuccess) {
            refetch()
        }
    }, [isRemoveRoleSuccess])

    const handleRemoveRoleClick = useCallback((id: number) => removeRole({id}), [])


    return <div className="moduleRoles">
        {data?.map((role) => <RoleCard key={role.id}  {...role} setRole={setRole} handleRemoveRoleClick={handleRemoveRoleClick} />)}
        <RoleDetailsModal chosenRole={chosenRole} setRole={setRole} refetchRoles={refetch} />
        <SplashScreen active={isLoading} />
    </div>

}

export default ModuleRoles