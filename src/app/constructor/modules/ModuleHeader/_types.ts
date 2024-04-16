import { TDefaultModule } from "../_types";
import { TComponentButton } from "../../components/ComponentButton/_types";

export type TModuleHeader = TDefaultModule<"header", { buttons: Array<TComponentButton> }, { title: string, description: string }>