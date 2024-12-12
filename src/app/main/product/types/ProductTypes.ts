/**
 * PreviousStatementWidgetType
 */
export type ProductPayloadType = {
	asin: string;
};

export type HistoryType = {
    product_id: string;
	id?: string;
	asin: string;
    favourite_id?: string;
	user_id:string;
	image: string;
    item_name: string;
    manufacturer: string;
    model_number: string;
    release_date: string;
    size: string;
    color: string;
    style: string;
    product_data: any;
    offers_data: any;
    alerts: any;
    listing_stats: any;
    buy_box_distribution: any;
    charts: any;
    variations: any;
    lowBsr : boolean;
    highVolume : boolean;    
}

export type ProductJsonType = {
    alerts: any;
    buy_box_distribution: any;
    fee_breakdown: any;
    listing_stats: any;
    offers_data: any;
    product_info: any;
    variations: any;
}

export type BuyListPayloadType = {
    product_id: string;
}