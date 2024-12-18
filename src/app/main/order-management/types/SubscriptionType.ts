
export type SubscriptionType = {
	id: string;
	title: string;
	description: string;
	monthly_price: number;
	yearly_price: number;
	trial_days: number;
	feature_line: string;
	feature_01: string;
	feature_02: string;
	feature_03: string;
	feature_04: string;
	feature_05: string;
	popular: boolean;
	is_active: boolean;

	bill_mode?: string;
	name: string;
	subscription_id: string;
	payment_method_id: number;
	order_exists: boolean;
};

/**
 * Recent Payment Type
 */


export type SubscriptionDataType={
	pages: number;
	page: number;
	limit: number;
	total: number;
	records: [SubscriptionType];

}

