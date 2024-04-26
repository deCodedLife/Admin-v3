import { IntlShape } from "react-intl"

export type TMessage = {
    id: number,
    avatar?: string;
    created_at: string,
    message: string,
    author_id: { title: string, value: number },
    is_readed: { title: string, value: "Y" | "N" },
    chat_id: { title: string, value: number },
    group_id: { title: string, value: number },
}

export type TListItem = { title: string, id: number }

export type TModuleDialogMessage = {
    message: TMessage,
    isOwnMessage: boolean,
    messages_object: string,
    intl: IntlShape,
}

export type TModuleDialogCount = {
    count?: {
        total: number,
        groups: { [key: string | number]: number } | Array<any>,
        chats: { [key: string | number]: number } | Array<any>
    }
}

export type TModuleDialogToggleButton = TModuleDialogCount & { buttonRef: React.MutableRefObject<HTMLDivElement | null> }

export type TModuleDialog = {
    groups: { object: string, property: string },
    chats: { object: string, property: string },
    messages: { object: string }
}

export type TModuleDialogChat = TModuleDialog & TModuleDialogCount & {
    selectedGroup: { title: string, id: number } | null,
    selectedChat: { title: string, id: number } | null,
    setSelectedGroup: (group: TModuleDialogChat["selectedGroup"]) => void,
    setSelectedChat: (group: TModuleDialogChat["selectedChat"]) => void
}



export type TModuleDialogChatsWrapper = TModuleDialogCount & {
    chats: Array<TListItem> | undefined,
    selectedGroup: TListItem | null,
    selectedChat: TListItem | null,
    setSelectedChat: (group: TListItem) => void
}

export type TModuleDialogGroupsWrapper = TModuleDialogCount & {
    groups: Array<TListItem> | undefined,
    selectedGroup: TListItem | null,
    setSelectedGroup: (group: TListItem) => void
}