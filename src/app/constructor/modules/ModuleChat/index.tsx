import React, { useEffect, useState } from "react"
import ComponentButton from "../../components/ComponentButton"
import { useHorizontalScroll } from "../helpers"
import { toAbsoluteUrl } from "../../../../_metronic/helpers"
import { Formik, Form as FormikForm } from "formik"
import ComponentTextarea from "../../components/ComponentTextarea"
import { useAuth } from "../../../modules/auth"
import useMutate from "../../../api/hooks/useMutate"
import useChat from "../../../api/hooks/useChat"
import * as Yup from 'yup';
import useUpdate from "../../../api/hooks/useUpdate"
import { useIntl } from "react-intl"
import { TModuleChat } from "./_types"

const ModuleChat: React.FC<TModuleChat> = (props) => {
    const intl = useIntl()
    const { currentUser } = useAuth()

    const { objects: groupObject, property: groupKey } = props.settings.groups
    const { data: groups, refetch: updateChatGroups } = useChat(groupObject, {})

    const [selectedGroup, setSelectedGroup] = useState<any>(null)
    const handleGroupClick = (group: any) => setSelectedGroup(group)
    const { objects: chatObject, property: chatKey } = props.settings.chats
    const { data: chats, refetch: updateChats } = useChat(chatObject, { [groupKey]: selectedGroup?.id, scripts: ["get_unread_messages_count"] }, Boolean(selectedGroup))
    const isEmptyChatGroup = Array.isArray(chats) && !chats.length

    const [selectedChat, setSelectedChat] = useState<any>(null)
    useEffect(() => {
        const container = document.querySelector(".moduleChat")
        const isMobile = window.innerWidth <= 767
        if (isMobile && container) {
            container.scrollBy({
                left: selectedChat ? container.clientWidth : -container.clientWidth,
                behavior: "smooth"
            })
        }
    }, [selectedChat])

    const handleChatClick = (chat: any) => {
        setSelectedChat(chat)
    }

    const { objects: messageObject } = props.settings.messages
    const { data: messages, refetch: updateMessages } = useChat(messageObject, { [chatKey]: selectedChat?.id, limit: 2000 }, Boolean(selectedChat))
    const { mutate: sendMessage } = useMutate(messageObject, "add")
    const isEmptyChat = Array.isArray(messages) && !messages.length
    const handleSendMessage = (values: any) => sendMessage(values)

    const scrollRef = useHorizontalScroll();

    useEffect(() => {
        const list = document.querySelector(".moduleChat_messagesContainer")
        if (list) {
            list.scrollTop = list.scrollHeight
        }
    }, [messages])

    useUpdate([
        { active: true, update: updateChatGroups },
        { active: Boolean(selectedGroup), update: updateChats },
        { active: Boolean(selectedChat), update: updateMessages }
    ], props.hook, 1000)

    const validationSchema = Yup.object().shape({
        message: Yup.string().required(" ")
    })

    return <div className="moduleChat">
        <div className="moduleChat_chats">
            <div className="card">
                <div className="card-header">
                    {/*@ts-ignore  */}
                    <div ref={scrollRef} className="moduleChat_chatGroups">
                        <ul>
                            {groups?.map(group => <li
                                key={group.id}
                                className={`moduleChat_chatGroup${group.id === selectedGroup?.id ? " selected" : ""}`}
                                onClick={() => handleGroupClick(group)}>
                                <span className="moduleChat_chatGroupContent">
                                    {group.title}
                                </span>
                                {/*  <span className="badge badge-primary">8</span> */}
                            </li>)}
                        </ul>
                    </div>
                </div>
                <div className={`card-body${!chats || isEmptyChatGroup ? " card-empty" : ""}`}>
                    {chats ? isEmptyChatGroup ? <div className="moduleChat_emptyList">{intl.formatMessage({ id: "CHAT.EMPTY_GROUPS_LIST" })}</div> :
                        <ul className="moduleChat_chatsList">
                            {chats.map(chat => <li key={chat.id} className={`moduleChat_chat${chat.id === selectedChat?.id ? " selected" : ""}`} onClick={() => handleChatClick(chat)}>
                                <span className="moduleChat_chatContent">
                                    {chat.title}
                                </span>
                                {chat.unread_messages_count ? <span className="badge badge-primary">{chat.unread_messages_count}</span> : null}
                            </li>)}
                        </ul> : <div className="moduleChat_emptyList">{intl.formatMessage({ id: "CHAT.SELECT_CHAT_GROUP_PREVIEW" })}</div>}
                </div>
            </div>
        </div>
        <div className="moduleChat_messages">
            {messages ? <div className="card">
                <div className="card-header moduleChat_messagesTitle">
                    <div className="card-title">
                        {selectedChat?.title}
                    </div>
                </div>
                <div className={`card-body moduleChat_messagesContainer${isEmptyChat ? " card-empty" : ""}`}>
                    {isEmptyChat ? <div className="moduleChat_emptyList">{intl.formatMessage({ id: "CHAT.EMPTY_MESSAGES_LIST" })}</div> :
                        messages.map((message: { id: number, message: string, user_id: { title: string, value: number } | null }) => <div key={message.id} className={`moduleChat_messageContainer${Number(message.user_id?.value) === Number(currentUser?.id) ? " author" : ""}`}>
                            <div className="moduleChat_messageProperties">
                                <img src={toAbsoluteUrl("/media/avatars/blank.png")} alt="" className="moduleChat_messagePhoto" />
                                <div className="moduleChat_messageDescription">
                                    <span className="moduleChat_messageAuthor">{message.user_id?.title ?? intl.formatMessage({ id: "CHAT.DEFAULT_AUTHOR_NAME" })}</span>
                                    <span className="moduleChat_messageDate">15:30</span>
                                </div>
                            </div>
                            <div className="moduleChat_messageContent">{message.message}</div>
                        </div>)}
                </div>
                <div className="card-footer moduleChat_messagesForm">
                    <Formik
                        enableReinitialize
                        initialValues={{
                            message: "",
                            supportQuestion_id: selectedChat?.id
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            handleSendMessage(values)
                            resetForm()
                        }}

                    >
                        {({ handleSubmit }) => {
                            return <FormikForm>
                                <div className="moduleChat_messagesTextarea">
                                    <ComponentTextarea article="message" />
                                </div>
                                <div className="moduleChat_messagesButtonsContainer">
                                    <ComponentButton
                                        className="moduleChat_messagesGoBackButton"
                                        type="submit"
                                        settings={{ title: intl.formatMessage({ id: "BUTTON.PREVIOUS" }), background: "light", icon: "" }}
                                        customHandler={() => setSelectedChat(null)}
                                    />
                                    <ComponentButton
                                        className="moduleChat_messagesSubmitButton"
                                        type="submit"
                                        settings={{ title: intl.formatMessage({ id: "BUTTON.SEND" }), background: "dark", icon: "" }}
                                        customHandler={handleSubmit}
                                    />
                                </div>

                            </FormikForm>
                        }}
                    </Formik>
                </div>
            </div> : null}

        </div>

    </div>
}

export default ModuleChat