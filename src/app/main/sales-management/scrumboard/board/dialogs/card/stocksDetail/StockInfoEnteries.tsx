
type Props = {
    name: string;
    value: string;
    showDollarSign?: boolean;
    showPercentageSign?: boolean;
}

export default function StockCardEntery({ name, value, showDollarSign, showPercentageSign }: Props) {
    return (
        <div className="flex flex-row justify-between width-full px-6 border-b border-gray-300-300 mt-2">
            <span className="text-sm font-medium text-secondary text-gray-600 whitespace-nowrap px-16">
                {name}
            </span>
            <span className="font-bold px-16">{showDollarSign ? `$${value}` : showPercentageSign ? `${value}%` : value}</span>
        </div>
    )
}