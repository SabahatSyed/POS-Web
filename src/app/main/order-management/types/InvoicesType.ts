export type InvoiceType = {
	id: string;
    bill_mode: string;
    billing_period_from: number;
    billing_period_to: number;
    description: string;
    name: string;
    payment_date: number;
    payment_status: string;
    total_amount: string;
    subs: string;
};

export type InvoicesDataType={
	count: number;
	pages: number;
	records: [InvoiceType]
}