import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import BuyBoxChart from './BuyBoxChart';
import StarRating from '../StarRating/StarRating';

/**
 * The ProfitCalculatorWidget.
 */
function BuyBoxDistributionWidget({ data=[] }) {

    // console.log(data);

    const series = data.filter((item) => {
        return item?.perc >= 1;
    });
    const seriesTable = data.filter((item) => {
      return item?.perc >= 1;
    });


    const points = data.filter((item) => item.perc < 1 );
    if (points && points.length > 0) {
        const totalPoints = data.reduce((acc, curr) => acc + curr.perc, 0);
        const totalPoints1= series.reduce((acc, curr) => acc + curr.perc, 0);
        const adjustedTotalPoints = totalPoints - totalPoints1;
        const adjustedTotalPoints1 = 100 - totalPoints;
        
        series.push({
          seller_name: "SUPPRESSED",
          perc: adjustedTotalPoints1,
          "seller.is_fba": "N/A",
        });
        series.push({
            seller_name: "Others",
            perc: adjustedTotalPoints, 
            "seller.is_fba": "N/A"
        });
        seriesTable.push({
          seller_name: "Others",
          perc: adjustedTotalPoints,
          "seller.is_fba": "N/A",
        });
        
        seriesTable.push({
          seller_name: "SUPPRESSED",
          perc: adjustedTotalPoints1,
          "seller.is_fba": "N/A",
        });
    }
    return (
      <div className="relative flex flex-col rounded-2xl gap-16 overflow-hidden">
        <div className="flex  justify-between p-24 bg-[#D5E6E9]">
          <div className="flex flex-col">
            <Typography className="text-2xl font-bold tracking-tight leading-6 truncate text-secondary">
              Buy Box Distribution
            </Typography>
          </div>
          {/* <div className='flex justify-end gap-6'>
                    <div className=' rounded-4 text-black text-sm p-6' style={{background: "linear-gradient(180deg, #DDD 0%, #A3A3A3 100%)"}}>Recent</div>
                    <div className=' rounded-4 text-white text-sm p-6 bg-secondary'>All Offers</div>

				</div> */}
        </div>
        {
          series && series?.length > 0 && (
            <div className="flex  flex-col py-4 px-16 max-h-[320px] overflow-auto">
              <table id="customer">
                <thead>
                  <tr className="tableheader">
                    <th className="rowblue">Seller</th>
                    <th>FBA/FBM</th>
                    <th className="rowblue">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {seriesTable?.map((seller, index) => (
                    <tr key={index} className="tablerow">
                      <td className="rowblue tdrow">
                        <a
                          target="_blank"
                          style={{ backgroundColor: "white", border: "none" }}
                          href={`/storefront-search?storeFrontUrl=https://www.amazon.com/s?me=${seller.seller_id}`}
                        >
                          {/* {seller.seller_name?? seller.seller_id} */}
                          {seller.seller_name ?? seller.seller_id} {seller.seller_name !='Others'&& seller?.seller_name != "SUPPRESSED" &&
                          `[${seller?.seller_name ? seller?.total_ratings?.toLocaleString():"N/A"}]`}
                        </a>
                      {seller?.seller_name !='Others' && seller?.seller_name != "SUPPRESSED"
                      &&
                       <div>
                          {seller?.seller_name && <StarRating percentage={seller?.positive_rating_perc} />}
                       </div>
                       }
                      </td>
                      <td style={{ color: seller.is_fba ? "green" : "blue" }}>
                        {seller?.seller_name === "Others" || seller?.seller_name === "SUPPRESSED"
                          ? "N/A" 
                          : seller.is_fba
                          ? "FBA"
                          : "FBM"}
                      </td>
                      <td className="rowblue">{seller.perc.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
          // : (
          //   <div className="w-full text-center text-gray-500 font-600 p-5 mb-16">
          //     No Data
          //   </div>
          // )
        }
        {series && series?.length > 0 ? (
          <div className="m-8 p-4">
            <BuyBoxChart data={series} />
          </div>
        ) : (
          <div className="m-8 p-4">
            <BuyBoxChart data={[]} />
          </div>
        )}
      </div>
    );
}

export default memo(BuyBoxDistributionWidget);
