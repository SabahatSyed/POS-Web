import { Typography } from '@mui/material'
import StockCardEntery from './StockInfoEnteries'
import { DealData } from '../../../../types/DealDataType'

type Props = {
  deal_data: DealData
}

export default function StockCalculations({ deal_data }: Props) {
  return (
    <div className="flex flex-col gap-8 flex-auto width-full">
      <Typography className="font-semibold text-center text-14 text-gray-600 mx-2">
        Calculations
      </Typography>
      <StockCardEntery name='Max Risk Shares' value={deal_data?.calculations?.max_risk_shares?.toLocaleString() || '-'} />
      <StockCardEntery name='Max Risk Amount' value={deal_data?.calculations?.max_risk_amount?.toLocaleString() || '-'} showDollarSign={true} />
      <StockCardEntery name='Current Company Rate' value={deal_data?.calculations?.current_company_rate?.toLocaleString() || '-'} showPercentageSign={true} />
      <StockCardEntery name='Estimated LTV' value={deal_data?.calculations?.estimated_ltv?.toLocaleString() || '-'} showPercentageSign={true} />
      <StockCardEntery name='Estimated Interest' value={deal_data?.calculations?.estimated_interest?.toLocaleString() || '-'} showPercentageSign={true} />
      <StockCardEntery name='Money Exposure' value={deal_data?.calculations?.money_exposure?.toLocaleString() || '-'} />
      <StockCardEntery name='Term Multiplier' value={deal_data?.calculations?.term_multiplier?.toLocaleString() || '-'} showPercentageSign={true} />
      <StockCardEntery name='Term Adjusted LTV' value={deal_data?.calculations?.term_adjusted_ltv?.toLocaleString() || '-'} showPercentageSign={true} />
      <StockCardEntery name='Term Adjusted Rate' value={deal_data?.calculations?.term_adjusted_rate?.toLocaleString() || '-'} showPercentageSign={true} />
      <StockCardEntery name='Adjusted Money Exposure' value={deal_data?.calculations?.term_adjusted_rate?.toLocaleString() || '-'} />
    </div>
  )
}