import { TDefaultModule } from "../_types";
import { TComponentFilter } from "../../components/ComponentFilters/_types";

export type TModuleYandexMap = TDefaultModule<"yandex_map", { filters: Array<TComponentFilter> }, { object: string, filters: any }>