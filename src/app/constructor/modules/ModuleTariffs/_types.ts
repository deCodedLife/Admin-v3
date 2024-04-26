import { TDefaultModule } from "../_types";

export type TModuleTariffsCard = {
    article: string,
    title: string,
    description: string,
    price: number,
    price_text: string,
    old_price: number | null,
    points: Array<{ title: string, is_check: boolean }>
}

export type TModuleTariffs = TDefaultModule<"tariffs", [], {
    title: string,
    description: string,
    article: string,
    quantity?: { is_active: boolean, title: Array<string> },
    tariffs: Array<TModuleTariffsCard>
}
>