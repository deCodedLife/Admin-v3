import { TDefaultModule } from "../_types"


export type TModuleChat = TDefaultModule<"chat", any, {
    groups: { objects: string, property: string },
    chats: { objects: string, property: string },
    messages: { objects: string }
}>