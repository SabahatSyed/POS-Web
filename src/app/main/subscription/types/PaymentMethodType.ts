
export type PaymentType = {
	id: string;
	card_number: string;
	name: string;
	expire_on: string;
	status: string;
	is_active: string;
	stripe_method_id: string;
};

export type PaymentPayload={
	method_id?: string;
	payment_method_id: string;
	full_name: string
}
export type PaymentDataType={
	count: number;
	pages: number;
	records: [PaymentType]
}
