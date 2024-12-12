export type BorroFormula = {
    _id: string;
    name: string,
    min_days: number,
    max_days: number,
    ltv_multiplier: number,
    ir_multiplier: number,
    term_table: string,
    term_multiplier: number,
}

export type BlockPurchaseFormula = {
    _id: string;
    name: string,
    min_days: number,
    max_days: number,
    ltv_multiplier: number,
    ir_multiplier: number,
    term_table: string,
    term_multiplier: number,
}

export type ELCFormula = {
    _id: string;
    name: string,
    volume_multiplier: number,
    discount: number,
    commitment_amount: number,
    commitment_shares: number,
    max_put_notice: number,
}
