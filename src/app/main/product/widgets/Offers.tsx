import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppSelector } from 'app/store';
import PreviousStatementWidgetType from '../types/PreviousStatementWidgetType';
import { Input } from '@mui/material';
import history from '@history';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';

/**
 * The OffersWidget component.
 */
function OffersWidget({ data }) {
  console.log(data);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(""); // 'asc' or 'desc'
  const getDatePlusDays = (plusDays = 3) => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + plusDays);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[futureDate.getMonth()];

  const day = String(futureDate.getDate()).padStart(2, "0");
  const year = futureDate.getFullYear();

  return `${monthName} ${day}`;
};

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
            return sortOrder === "asc" ? a.listing_price - b.listing_price : b.listing_price - a.listing_price;
        } else if (sortBy === "review_count") {
            return sortOrder === "asc" ? a.review_count - b.review_count : b.review_count - a.review_count;
        } else if (sortBy === "fbafbm") {
            return sortOrder === "asc" ? (a.is_FBM ? -1 : 1) : a.is_FBM ? 1 : -1;
        } else if (sortBy === "fulfillment") {
            return sortOrder === "asc" ? a.fulfillment_time - b.fulfillment_time : b.fulfillment_time - a.fulfillment_time;
        } else {
            return 0;
        }
    }):[]

    return (
      <div className="relative flex flex-col rounded-2xl gap-16 overflow-hidden">
        <div className="flex justify-between p-24 bg-[#D5E6E9]">
          <div className="flex flex-col gap-8">
            <Typography className="text-2xl font-bold tracking-tight leading-6 truncate text-secondary">
              Offers Overview
            </Typography>
          </div>
        </div>
        {sortedData?.length > 0 ? (
          <div className="flex  flex-col py-4 px-16 max-h-[420px] overflow-auto">
            <table id="customer">
              <thead>
                <tr className="tableheader">
                  <th
                    className="text-center text-black font-semibold p-2 text-md"
                    onClick={() => sortData("seller")}
                  >
                    Seller
                  </th>

                  <th
                    className="text-center text-black font-semibold p-2 text-md"
                    onClick={() => sortData("fbafbm")}
                  >
                    FBA/FBM
                  </th>
                  {/* <th
                    className="text-center text-black font-semibold p-2 text-md"
                    onClick={() => sortData("review_count")}
                  >
                    Review Count
                    {sortBy === "review_count" && sortOrder === "desc" ? (
                      <span>
                        <ArrowDropDownIcon />
                      </span>
                    ) : sortBy === "review_count" && sortOrder === "asc" ? (
                      <span>
                        <ArrowDropUpIcon />
                      </span>
                    ) : (
                      ""
                    )}
                  </th> */}
                  <th
                    className="text-center text-black font-semibold p-2 text-md"
                    // onClick={() => sortData("fulfillment")}
                  >
                    Delivery Date{" "}
                    {/* {sortBy === "fulfillment" && sortOrder === "desc" ? (
                      <span>
                        <ArrowDropDownIcon />
                      </span>
                    ) : sortBy === "fulfillment" && sortOrder === "asc" ? (
                      <span>
                        <ArrowDropUpIcon />
                      </span>
                    ) : (
                      ""
                    )} */}
                  </th>
                  <th
                    className="text-center text-black font-semibold p-2 text-md"
                    onClick={() => sortData("price")}
                  >
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
                {sortedData.map((offer, index) => (
                  <tr className="tablerow" key={index}>
                    <td className="text-secondary flex items-center justify-center" style={{ fontWeight: 600 }}>
                      <a
                        target="_blank"
                        style={{ backgroundColor: "white", border: "none"  }}
                        href={`/storefront-search?storeFrontUrl=https://www.amazon.com/s?me=${offer.seller_id}`}
                      >
                        {offer?.seller_name ?? offer.seller_id}{" "}
                        {offer?.seller_name?`[${offer?.total_ratings.toLocaleString()}]`:`[N/A]`}
                      </a>
                        {offer?.seller_name && <StarRating percentage={offer?.positive_rating_perc} />}
                    </td>
                    <td style={{ color: offer.is_FBM ? "blue" : "green" }}>
                      {offer.is_FBM ? "FBM" : "FBA"}
                    </td>
                    {/* <td>
                      {new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(offer.review_count)}
                    </td> */}
                    <td>
                      {offer.is_FBM
                        ? `${getDatePlusDays(3)}`
                        : `${getDatePlusDays(2)}`}
                    </td>
                    <td>
                      {"$" + offer.listing_price.toFixed(2).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="health-nodata text-gray-500 font-600 p-5 mb-16  text-center">
            No Offers
          </div>
        )}
      </div>
    );
}

export default memo(OffersWidget);
