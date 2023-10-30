import { Formik, Form as FormikForm } from "formik"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { KTSVG, toAbsoluteUrl } from "../../../_metronic/helpers"
import useChat from "../../api/hooks/useChat"
import ComponentButton from "../components/ComponentButton"
import ComponentTextarea from "../components/ComponentTextarea"
import * as Yup from 'yup';
import useMutate from "../../api/hooks/useMutate"
import moment from "moment"
import { useAuth } from "../../modules/auth"
import { IntlShape, useIntl } from "react-intl"
import api from "../../api"
import { createPortal } from "react-dom"
import useMessageNotifications from "../../api/hooks/useMessageNotifications"
import usePrevious from "../helpers/usePrevious"
import { toast } from "react-hot-toast"
import clsx from "clsx"
import useMessagesCount from "../../api/hooks/useMessagesCount"


export type TMessage = {
    id: number,
    created_at: string,
    message: string,
    author_id: { title: string, value: number },
    is_readed: { title: string, value: "Y" | "N" },
    chat_id: { title: string, value: number },
    group_id: { title: string, value: number },
}

type TListItem = { title: string, id: number }

type TModuleDialogMessage = {
    message: TMessage,
    isOwnMessage: boolean,
    messages_object: string,
    intl: IntlShape,
}

type TModuleDialogCount = {
    count?: {
        total: number,
        groups: { [key: string | number]: number } | Array<any>,
        chats: { [key: string | number]: number } | Array<any>
    }
}

type TModuleDialog = {
    groups: { object: string, property: string },
    chats: { object: string, property: string },
    messages: { object: string }
}

type TModuleDialogChat = TModuleDialog & TModuleDialogCount & {
    selectedGroup: { title: string, id: number } | null,
    selectedChat: { title: string, id: number } | null,
    setSelectedGroup: (group: TModuleDialogChat["selectedGroup"]) => void,
    setSelectedChat: (group: TModuleDialogChat["selectedChat"]) => void
}



type TModuleDialogChatsWrapper = TModuleDialogCount & {
    chats: Array<TListItem> | undefined,
    selectedGroup: TListItem | null,
    selectedChat: TListItem | null,
    setSelectedChat: (group: TListItem) => void
}

type TModuleDialogGroupsWrapper = TModuleDialogCount & {
    groups: Array<TListItem> | undefined,
    selectedGroup: TListItem | null,
    setSelectedGroup: (group: TListItem) => void
}



const itemClass = 'ms-1 ms-lg-3'
const btnClass =
    'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px'
const btnIconClass = 'svg-icon-1'

const ModuleDialogMessage: React.FC<TModuleDialogMessage> = ({ message, intl, isOwnMessage, messages_object }) => {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting)
        })
        observer.observe(ref?.current as Element)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (isVisible && !isOwnMessage && message.is_readed.value === "N") {
            api("chat", "read", { id: message.id, messages_object })
        }
    }, [isVisible])

    return <div ref={ref} key={message.id} className={`moduleMiniChat_messageContainer${isOwnMessage ? " author" : ""}`}>
        <div className="moduleMiniChat_messageProperties">
            <img src={toAbsoluteUrl("/media/avatars/blank.png")} alt="" className="moduleMiniChat_messagePhoto" />
            <div className="moduleMiniChat_messageDescription">
                <span className="moduleMiniChat_messageAuthor">{message.author_id?.title ?? intl.formatMessage({ id: "DIALOG.DEFAULT_USER_NAME" })}</span>
                <span className="moduleMiniChat_messageDate">{moment(message.created_at).format("DD MMM HH:mm")}</span>
            </div>
        </div>
        <div className="moduleMiniChat_messageContent">{message.message}</div>
    </div>
}

type TModuleDialogMessagesWrapper = {
    messagesList: Array<TMessage> | undefined,
    isMessagesFetching: boolean,
    selectedChat: TListItem | null,
    chats: TModuleDialog["chats"],
    messages: TModuleDialog["messages"]
    intl: IntlShape,
    sendMessage: (value: any) => void

}

const ModuleDialogMessagesWrapper: React.FC<TModuleDialogMessagesWrapper> = ({ messagesList, selectedChat, intl, isMessagesFetching, messages, chats, sendMessage }) => {
    const { currentUser } = useAuth()
    const validationSchema = Yup.object().shape({
        message: Yup.string().required(" ")
    })

    return <div className={`moduleDialog_messagesWrapper${selectedChat ? " active" : ""}`}>
        {Array.isArray(messagesList) && messagesList.length ? <div className="moduleDialog_messagesContainer">
            {messagesList.map((message) => <ModuleDialogMessage
                key={message.id}
                message={message}
                isOwnMessage={Number(message.author_id?.value) === Number(currentUser?.id)}
                intl={intl}
                messages_object={messages.object}
            />
            )}
        </div> : <div className="moduleDialog_emptyContainer">
            {isMessagesFetching ? intl.formatMessage({ id: "DIALOG.LOADING" }) : intl.formatMessage({ id: "DIALOG.EMPTY_MESSAGES_LIST" })}
        </div>}

        <div className="moduleDialog_messagesForm">
            <Formik
                enableReinitialize
                initialValues={{
                    message: "",
                    [chats.property]: selectedChat?.id
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    sendMessage(values)
                    resetForm()
                }}

            >
                {({ handleSubmit }) => {
                    return <FormikForm>
                        <div className="moduleDialog_messagesTextarea">
                            <ComponentTextarea article="message" />
                        </div>
                        <div className="moduleDialog_messagesButtonsContainer">
                            <ComponentButton
                                className="moduleDialog_messagesSubmitButton"
                                type="submit"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.SEND" }), background: "dark", icon: "" }}
                                customHandler={handleSubmit}
                            />
                        </div>
                    </FormikForm>
                }}
            </Formik>
        </div>
    </div>
}

const ModuleDialogChatsWrapper: React.FC<TModuleDialogChatsWrapper> = ({ chats, selectedChat, setSelectedChat, selectedGroup, count }) => {
    return <div className={`moduleDialog_chatsWrapper${selectedGroup ? " active" : ""}`}>
        {
            Array.isArray(chats) ? <ul className="moduleDialog_chatsList">
                {chats.map((chat) => <li key={chat.id}>
                    <div
                        className={`moduleDialog_chatItem${selectedChat?.id === chat.id ? " selected" : ""}`}
                        onClick={() => setSelectedChat({ id: chat.id, title: chat.title })}>
                        {chat.title}
                        {count?.chats?.[chat.id] ? <span className="moduleDialog_counter">{count.chats[chat.id]}</span> : null}
                    </div>
                </li>)}
            </ul> : null
        }
    </div>
}

const ModuleDialogGroupsWrapper: React.FC<TModuleDialogGroupsWrapper> = ({ groups, selectedGroup, setSelectedGroup, count }) => {
    return <div className="moduleDialog_groupsWrapper">
        {
            Array.isArray(groups) ? <ul className="moduleDialog_groupsList">
                {groups.map((group) => <li key={group.id}>
                    <div className={`moduleDialog_groupItem${selectedGroup?.id === group.id ? " selected" : ""}`}
                        onClick={() => setSelectedGroup({ id: group.id, title: group.title })}>
                        {group.title}
                        {count?.groups?.[group.id] ? <span className="moduleDialog_counter">{count.groups[group.id]}</span> : null}
                    </div>
                </li>)}
            </ul> : null
        }
    </div>
}



const ModuleDialogChat: React.FC<TModuleDialogChat> = ({ groups, chats, messages, count, selectedChat, selectedGroup, setSelectedChat, setSelectedGroup }) => {
    const {
        data: groupsList,
        refetch: updateChatGroups
    } = useChat<Array<{ title: string, id: number }>>(groups.object, { context: { block: "chat" } })
    const {
        data: chatsList,
        refetch: updateChats
    } = useChat<Array<{ title: string, id: number }>>(chats.object, { [groups.property]: selectedGroup?.id, context: { block: "chat" } }, Boolean(selectedGroup?.id))
    const {
        data: messagesList,
        isFetching: isMessagesFetching,
        refetch: updateMessages
    } = useChat<Array<TMessage>>(messages.object, { [chats.property]: selectedChat?.id, limit: 1000 }, Boolean(selectedChat?.id))

    const intl = useIntl()

    useEffect(() => {
        if (count && selectedChat) {
            updateMessages()
        }
    }, [count])

    const handleReturnClick = () => {
        if (selectedGroup) {
            if (selectedChat) {
                return setSelectedChat(null)
            } else {
                return setSelectedGroup(null)
            }
        } else {
            return
        }
    }

    const { mutate: sendMessage, isSuccess } = useMutate(messages.object, "add")

    useEffect(() => {
        if (isSuccess) {
            updateMessages()
        }
    }, [isSuccess])

    useEffect(() => {
        const list = document.querySelector(".moduleDialog_messagesContainer")
        if (list) {
            list.scrollTop = list.scrollHeight
        }
    }, [messagesList])

    //обработчик закрытия диалогового окна через Escape
    const closeButtonRef = useRef<HTMLDivElement | null>(null)
    const handleCloseButton = useCallback((event: KeyboardEvent) => {
        if (closeButtonRef.current && event.key === "Escape") {
            closeButtonRef.current.click()
        }
    }, [])
    useEffect(() => {
        document.addEventListener("keydown", handleCloseButton)
        return () => document.removeEventListener("keydown", handleCloseButton)
    }, [])

    return createPortal(<div
        id='moduleDialog'
        className='bg-body'
        data-kt-drawer='true'
        data-kt-drawer-name='chat'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'300px', 'md': '500px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#moduleDialog_toggle'
        data-kt-drawer-close='#moduleDialog_close'
    >
        <div className='moduleDialog card w-100 rounded-0' id='kt_drawer_chat_messenger'>
            <div className='card-header pe-5 flex-nowrap' id='kt_drawer_chat_messenger_header'>
                <div className='card-title'>
                    <div
                        className={`moduleDialog_returnButton${!selectedGroup ? " disabled" : ""} btn btn-sm btn-icon btn-active-light-primary`}
                        onClick={handleReturnClick}>
                        <KTSVG path='/media/icons/duotune/arrows/arr022.svg' className='svg-icon-2' />
                    </div>
                    <div className='d-flex justify-content-center flex-column me-3'>
                        <a href='#' className='moduleDialog_sectionTitle' onClick={event => event.preventDefault()}>
                            {selectedGroup ? selectedChat ? selectedChat.title : selectedGroup.title : intl.formatMessage({ id: "DIALOG.TITLE" })}
                        </a>

                        <div className='mb-0 lh-1'>
                            <span className='badge badge-success badge-circle w-10px h-10px me-1'></span>
                            <span className='fs-7 fw-bold text-gray-400'>{intl.formatMessage({ id: "DIALOG.CONNECT_STATUS" })}</span>
                        </div>
                    </div>
                </div>

                <div className='card-toolbar'>
                    <div ref={closeButtonRef} className='btn btn-sm btn-icon btn-active-light-primary' id='moduleDialog_close'>
                        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-2' />
                    </div>
                </div>
            </div>
            <div className="moduleDialog_body card-body">
                <ModuleDialogGroupsWrapper groups={groupsList} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} count={count} />
                <ModuleDialogChatsWrapper chats={chatsList} selectedGroup={selectedGroup} selectedChat={selectedChat} setSelectedChat={setSelectedChat} count={count} />
                <ModuleDialogMessagesWrapper
                    messagesList={messagesList}
                    selectedChat={selectedChat}
                    isMessagesFetching={isMessagesFetching}
                    messages={messages}
                    chats={chats}
                    intl={intl}
                    sendMessage={sendMessage}
                />
            </div>

        </div>
    </div>, document.body)
}

const ModuleDialogToggleButton: React.FC<TModuleDialogCount & { buttonRef: React.MutableRefObject<HTMLDivElement | null> }> = ({ count, buttonRef }) => {
    return <div className={clsx('app-navbar-item position-relative', itemClass)}>
        <div ref={buttonRef} className={clsx('position-relative', btnClass)} id='moduleDialog_toggle'>
            <KTSVG path='/media/crm/icons/chat.svg' className={btnIconClass} />
        </div>
        {count?.total ? <span className="notifications_count">{count?.total}</span> : null}
    </div>
}

const ModuleDialog: React.FC<TModuleDialog> = (props) => {
    const [selectedGroup, setSelectedGroup] = useState<{ id: number, title: string } | null>(null)
    const [selectedChat, setSelectedChat] = useState<{ id: number, title: string } | null>(null)
    const { data: messagesNotifications } = useMessageNotifications()
    const previousMessagesNotifications = usePrevious(messagesNotifications)
    const { data: count } = useMessagesCount()
    const toggleButtonRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (Array.isArray(messagesNotifications) && messagesNotifications.length) {
            const notificationsToShow = Array.isArray(previousMessagesNotifications) ?
                messagesNotifications.filter(notification => !previousMessagesNotifications.some(previousNotification => previousNotification.id === notification.id)) : messagesNotifications
            notificationsToShow.forEach(notification => {
                const audio = new Audio(`${toAbsoluteUrl("/media/crm/sounds/message.mp3")}`)
                audio.play()
                toast.custom(t => {
                    return <div className={`messageToast ${t.visible ? " show" : ""}`} onClick={event => {
                        if (event.target instanceof Element && !event.target.closest(".messageToast_closeButton")) {
                            toggleButtonRef.current?.click()
                            setSelectedGroup({ title: notification.group_id.title, id: Number(notification.group_id.value) })
                            setSelectedChat({ title: notification.chat_id.title, id: Number(notification.chat_id.value) })
                            toast.dismiss(t.id)
                        }
                    }}>
                        <img src={toAbsoluteUrl("/media/avatars/blank.png")} alt="" className="messageToast_avatar" />
                        <div className="messageToast_content">
                            <h4 className="messageToast_author">{notification.author_id.title}</h4>
                            <p className="messageToast_message">{notification.message}</p>
                        </div>
                        <button type="button" className="messageToast_closeButton" onClick={() => toast.dismiss(t.id)}>x</button>
                    </div>
                }, {
                    duration: 60000
                })
            })
        }
    }, [messagesNotifications])


    return <>
        <ModuleDialogToggleButton count={count} buttonRef={toggleButtonRef} />
        <ModuleDialogChat
            {...props}
            count={count}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
        />
    </>
}


export default ModuleDialog