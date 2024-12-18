import { Typography } from '@mui/material'
import { DealData } from '../../../../types/DealDataType'
import StockCardEntery from './StockInfoEnteries'

type Props = {
    deal_data: DealData
}

export default function StockTermDetail({ deal_data }: Props) {
    return (
        <div className="flex flex-col gap-8 flex-auto width-full">
            <Typography className="font-semibold text-center text-14 text-gray-600 mx-2">
                Term Detail
            </Typography>
            <StockCardEntery name='Requested Shares' value={deal_data?.deal_terms.requested_shares.toLocaleString() || '-'} />
            <StockCardEntery name='Final Stock Price' value={deal_data?.deal_terms.final_stock_price?.toLocaleString() || '-'} showDollarSign={true} />
            <StockCardEntery name='Aprx Portfolio Value' value={deal_data?.deal_terms.approx_portfolio_value?.toLocaleString() || '-'} showDollarSign={true} />
            <StockCardEntery name='Auto seller Premium' value={deal_data?.deal_terms?.auto_seller_premium?.toLocaleString() || '-'} showPercentageSign={true} />
            <StockCardEntery name='Document fee' value={deal_data?.deal_terms?.document_prep_fee?.toLocaleString() || '-'} showDollarSign={true} />
            {/* <StockCardEntery name='Agent fee' value={deal_data?.deal_terms?.agent?.toLocaleString() || '-'} /> */}
            <StockCardEntery name='Agent fee' value={'0'} showDollarSign={true} />
            <StockCardEntery name='Net Proceeds' value={deal_data?.deal_terms?.net_proceeds?.toLocaleString() || '-'} showDollarSign={true} />
            {/* <StockCardEntery name='Term Length' value={deal_data?.deal_terms?.?.toLocaleString() || '-'} showPercentageSign={true} /> */}
            <StockCardEntery name='Term Length' value={'0'} />
            <StockCardEntery name='Anual Interest Rate' value={deal_data?.deal_terms?.final_interest_rate_yearly?.toLocaleString() || '-'} showPercentageSign={true} />
            <StockCardEntery name='Annual Premium Amount' value={deal_data?.deal_terms?.total_annual_premium?.toLocaleString() || '-'} showDollarSign={true} />
        </div>
    )
}