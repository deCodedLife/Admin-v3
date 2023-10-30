import { Formik, Form as FormikForm } from "formik"
import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"
import useChat from "../../api/hooks/useChat"
import useMutate from "../../api/hooks/useMutate"
import { useAuth } from "../../modules/auth"
import { ModuleMiniChatType } from "../../types/modules"
import ComponentButton from "../components/ComponentButton"
import ComponentTextarea from "../components/ComponentTextarea"
import * as Yup from 'yup';
import { toAbsoluteUrl } from "../../../_metronic/helpers"
import moment from "moment"
import useUpdate from "../../api/hooks/useUpdate"
import { useIntl } from "react-intl"

const ModuleMiniChat: React.FC<ModuleMiniChatType> = (props) => {
    const intl = useIntl()
    const { settings, hook } = props
    const { pathname } = useLocation()
    const splitedUrl = pathname.slice(1).split("/")
    const id = Number.isInteger(Number(splitedUrl[splitedUrl.length - 1])) ? Number(splitedUrl[splitedUrl.length - 1]) : null
    const { data: messages, isFetching, refetch } = useChat(settings.object, { [settings.filter_property]: id, limit: 2000 }, Boolean(id))
    const { mutate: sendMessage, isSuccess } = useMutate(settings.object, "add")
    const { currentUser } = useAuth()

    useEffect(() => {
        if (isSuccess) {
            refetch()
        }
    }, [isSuccess])

    useEffect(() => {
        const list = document.querySelector(".moduleMiniChat_messagesContainer")
        if (list && list.scrollTop !== list.scrollHeight) {
            list.scrollTop = list.scrollHeight
        }
    }, [messages])

    useUpdate([{ active: Boolean(hook), update: refetch }], hook, 1000)

    const validationSchema = Yup.object().shape({
        message: Yup.string().required(" ")
    })
    return <div className="moduleMiniChat">
        <div className="card">
            <div className="card-body moduleMiniChat_messagesContainer">
                {Array.isArray(messages) && messages.length ?
                    messages.map((message: { id: number, message: string, author_id: { title: string, value: number } | null, created_at: string }) => <div key={message.id} className={`moduleMiniChat_messageContainer${Number(message.author_id?.value) === Number(currentUser?.id) ? " author" : ""}`}>
                        <div className="moduleMiniChat_messageProperties">
                            <img src={toAbsoluteUrl("/media/avatars/blank.png")} alt="" className="moduleMiniChat_messagePhoto" />
                            <div className="moduleMiniChat_messageDescription">
                                <span className="moduleMiniChat_messageAuthor">{message.author_id?.title ?? intl.formatMessage({ id: "MINI_CHAT.DEFAULT_AUTHOR_NAME" })}</span>
                                <span className="moduleMiniChat_messageDate">{moment(message.created_at).format("DD MMM HH:mm")}</span>
                            </div>
                        </div>
                        <div className="moduleMiniChat_messageContent">{message.message}</div>
                    </div>) : <div className="moduleMiniChat_emptyContainer">{!id ? intl.formatMessage({ id: "MINI_CHAT.CONNECTION_ERROR" }) : isFetching ?
                        intl.formatMessage({ id: "MINI_CHAT.LOADING" }) :
                        intl.formatMessage({ id: "MINI_CHAT.EMPTY_MESSAGES_LIST" })}</div>}
            </div>
            <div className="card-footer">
                <Formik
                    enableReinitialize
                    initialValues={{
                        message: "",
                        [settings.filter_property]: id,
                        author_id: Number(currentUser?.id)
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        sendMessage(values)
                        resetForm()
                    }}

                >
                    {({ handleSubmit }) => {
                        return <FormikForm>
                            <div className="moduleMiniChat_messagesTextarea">
                                <ComponentTextarea article="message" />
                            </div>
                            <div className="moduleMiniChat_messagesButtonsContainer">
                                <ComponentButton
                                    className="moduleMiniChat_messagesSubmitButton"
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
    </div>
}

export default ModuleMiniChat