export type OrderPayload={
	payment_method_id: string;
	subscription_id: string;
	yearly: boolean;
}
export type OrderType={
	order_id: string;
	subscription_id: string; 
	user_id: string;
	name: string;
	title: string;
	bill_mode: string; 
	order_price: number;
	order_status: string;
	next_check_time: number;
	is_active: string;
	subs: string;
	on_trial: boolean;
	auto_renewal: boolean;
	
}

export type OrderDataType={
	count: number;
	pages: number;
	records: [OrderType]
}