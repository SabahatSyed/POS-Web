import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useAppSelector } from 'app/store';
import PreviousStatementWidgetType from '../types/PreviousStatementWidgetType';
import { Input } from '@mui/material';
import history from '@history';
import * as yup from 'yup';

/**
 * The ProfitCalculatorWidget.
 */
function VariationsWidget({data}) {

    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(""); // 'asc' or 'desc'
    console.log(data);
    
    const sortData = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const sortedData = !!data?[...data].sort((a, b) => {
        if (sortBy === "price") {
            return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        } else if (sortBy === "review_count") {
            return sortOrder === "asc" ? a.review_count - b.review_count : b.review_count - a.review_count;
        }  else if (sortBy === "monthly_sold") {
            return sortOrder === "asc" ? a.monthly_sold - b.monthly_sold : b.monthly_sold - a.monthly_sold;
        } else {
            return 0;
        }
    }):[];

    return (
      <div className="relative flex flex-col rounded-2xl gap-16 overflow-hidden">
        <div className="flex  justify-between p-24 bg-[#D5E6E9]">
          <div className="flex flex-col gap-8">
            <Typography className="text-2xl font-bold tracking-tight leading-6 truncate text-secondary">
              Variations
            </Typography>
          </div>
          {/* <div className='flex justify-end gap-6'>
                    <div className=' rounded-4 text-black text-sm p-6' style={{background: "linear-gradient(180deg, #DDD 0%, #A3A3A3 100%)"}}>Recent</div>
                    <div className=' rounded-4 text-white text-sm p-6 bg-secondary'>All Offers</div>

				</div> */}
        </div>
        {sortedData?.length > 0 ? (
          <div className="flex  flex-col py-4 px-16 max-h-[420px] overflow-auto">
            <table id="customer">
              <thead>
                <tr className="tableheader">
                  <th className="rowblue">ASIN</th>
                  <th>Size</th>
                  <th>Color</th>
                  {/* <th>Review<p>Count</p></th> */}
                  <th onClick={() => sortData("monthly_sold")}>
                    Monthly Sold{" "}
                    {sortBy === "monthly_sold" && sortOrder === "asc" ? (
                      <span>
                        <ArrowDropUpIcon />
                      </span>
                    ) : sortBy === "monthly_sold" && sortOrder === "desc" ? (
                      <span>
                        <ArrowDropDownIcon />
                      </span>
                    ) : (
                      ""
                    )}
                  </th>
                  <th className="rowblue" onClick={() => sortData("price")}>
                    Price{" "}
                    {sortBy === "price" && sortOrder === "desc" ? (
                      <span>
                        <ArrowDropDownIcon />
                      </span>
                    ) : sortBy === "price" && sortOrder === "asc" ? (
                      <span>
                        <ArrowDropUpIcon />
                      </span>
                    ) : (
                      ""
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData?.map((item, index) => (
                  <tr key={index} className="tablerow">
                    <td className="rowblue">
                      <a
                        target="_blank"
                        style={{ backgroundColor: "white", border: "none" }}
                        href={`https://www.amazon.com/dp/${item.asin}`}
                      >
                        {item.asin}
                      </a>
                    </td>
                    <td className="rowgray">{item?.size}</td>
                    <td className="rowgray line-clamp-1">{item?.color}</td>
                    {/* <td className='rowgray'>{new Intl.NumberFormat('en-US', {
                          notation: 'compact',
                          compactDisplay: 'short',
                        }).format(item?.review_count)}</td> */}
                    <td className="rowgray">
                      {item?.monthly_sold > 0 ? (
                        <>
                          {item?.monthly_sold < 50
                            ? "<50"
                            : item?.monthly_sold < 100
                            ? "50+"
                            : item?.monthly_sold < 1000
                            ? `${Math.floor(item?.monthly_sold / 100) * 100}+`
                            : `${Math.floor(item?.monthly_sold / 500) * 500}+`}
                        </>
                      ) : (
                        "<50"
                      )}
                    </td>
                    <td className="rowblue">
                      {}$
                      {item.price
                        ? item?.price?.toFixed(2)?.toLocaleString()
                        : "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full text-center text-gray-500 font-600 p-5 mt-4 mb-16">
            No Variations
          </div>
        )}
        {/* <div className='flex gap-6 p-20'>
                <div className=' rounded-4 border border-secondary text-black text-xs p-6 bg-[#FFD481BA]' >Offers: {data?.data?.length}</div>
                <div className=' rounded-4 text-[#F160C9] border border-[#F160C9] text-xs p-6 bg-[#f1c3e53b]'>FBM: {data?.data?.filter((item)=>item.is_FBM).length}</div>
                <div className=' rounded-4 bg-[#c4f1c43b] text-[#008300] border border-[#008300] text-xs p-6 '>FBA: {data?.data?.filter((item)=>!item.is_FBM).length}</div>
                <div className=' rounded-4 text-[#F160C9] border border-[#F160C9] text-xs p-6 bg-[#f1c3e53b]'>AMZ</div>

            </div> */}
      </div>
    );
}

export default memo(VariationsWidget);
