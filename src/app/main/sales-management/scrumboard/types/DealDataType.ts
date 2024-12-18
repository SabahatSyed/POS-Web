type Calculations = {
    requested_shares?: number;
    max_risk_shares?: number;
    max_risk_amount?: number;
    estimated_value?: number;
    calculated_gross_proceeds?: number;
    money_exposure?: number;
    points?: number;
    origination_fee?: number;
    interest_rate?: number;
    current_company_rate?: number;
    terms?: string;
    rounded_money_exposure?: number;
    estimated_ltv?: number;
    estimated_interest?: number;
    term_multiplier?: number;
    term_adjusted_ltv?: number;
    term_adjusted_rate?: number;
    adjusted_money_exposure?: number;
    premium_override?: null | any; // Replace with the appropriate type if needed
    gross_amount?: number;
    a2me?: number;
    p2p?: number;
}

type DealTerms = {
    company?: string;
    stock?: string;
    term_table?: string;
    requested_shares?: number;
    approx_portfolio_value?: number;
    final_stock_price?: number;
    auto_seller_premium?: number;
    gross_proceeds?: number;
    points?: number;
    origination_fee?: number;
    document_prep_fee?: number;
    net_proceeds?: number;
    money_exposure?: number;
    loan_amount?: number;
    final_interest_rate_yearly?: number;
    monthly_premium_payment?: number;
    quarterly_premium_payment?: number;
    total_annual_premium?: number;
    equity_loss_simulation?: number;
    cost_basis?: number;
    estimated_profit?: string | any; // Replace with the appropriate type if needed
}

export type DealData = {
    calculations?: Calculations;
    deal_terms?: DealTerms;
}