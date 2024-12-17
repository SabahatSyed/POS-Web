import DemoContent from "@fuse/core/DemoContent";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import TrendChart from "./myChart"
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {useEffect , useState} from "react"
import data from "./data.json";
const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  "& .FusePageSimple-content": {},
  "& .FusePageSimple-sidebarHeader": {},
  "& .FusePageSimple-sidebarContent": {},
}));

function Details() {
  const [formattedDate, setFormattedDate] = useState('');
  const date = new Date(data.deal_activity[0].date_added * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
 useEffect(() => {
  const dateObject = new Date(data.date_updated * 1000);
  const format: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = dateObject.toLocaleDateString('en-US', format);
  setFormattedDate(formattedDate);
}, []);

  // const { t } = useTranslation("examplePage");
//  console.log("dataaa aaa" , data.data.calculations);
  return (
    <Root
      // header={
      //   <div className="p-24">
      //     <h4>{t("TITLE")}</h4>
      //   </div>
      // }
      content={
        <div className="px-44 flex flex-col gap-24 w-full h-full overflow-y-scroll">
          {/* <h4>Content</h4> */}
          <div className="flex flex-row mx-8 my-16 justify-between ">
            <p className="text-2xl  font-bold">Borro</p>
            <div className="flex flex-row justify-end">
              <Button
                className="mx-8"
                variant="contained"
                color="secondary"
                component={NavLinkAdapter}
                to="new/edit"
              >
                {/* <FuseSvgIcon size={20}>heroicons-outline:download</FuseSvgIcon> */}
                <span className="mx-8">Request document</span>
              </Button>
              <Button
                className="mx-8"
                variant="contained"
                color="secondary"
                component={NavLinkAdapter}
                to="new/edit"
              >
                {/* <FuseSvgIcon size={20}>heroicons-outline:download</FuseSvgIcon> */}
                <span className="mx-8">Move to Request Pipeline</span>
              </Button>
              <Button
                className="mx-8"
                variant="contained"
                color="secondary"
                component={NavLinkAdapter}
                to="new/edit"
              >
                <FuseSvgIcon size={20}>heroicons-outline:download</FuseSvgIcon>
                <span className="mx-8">Agreement</span>
              </Button>
            </div>
          </div>
          {/* <br /> */}
          {/* <DemoContent /> */}
          <div className="grid  grid-cols-2 md:grid-cols-3 gap-24  ">
            <div className="flex flex-col flex-auto bg-white shadow rounded-2xl col-span-2 md:col-span-1 ">
              <div className="cursor-pointer py-28 ">
                <div className="flex items-start justify-between mx-20    w-48 h-48 ">
                  <div className="flex items-center justify-center w-full h-full rounded-full text-lg uppercase bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200 ng-star-inserted p-10">
                    {/* {{customerInfo.avtar_holder}} */}s
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center mx-20 my-10">
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-600 font-medium text-secondary whitespace-nowrap">
                      Name
                    </span>
                    <span className="font-bold whitespace-nowrap ">
                      {data.name}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-auto width-full   ">
                  <div className="flex flex-row justify-between width-full px-6 border-b border-gray-300-300 mt-2">
                    <span className="text-sm font-medium text-secondary text-gray-600 whitespace-nowrap px-16">
                      Phone
                    </span>
                    <span className="font-bold px-16">{data.phone}</span>
                  </div>
                  <div className="flex flex-col justify-between width-full px-6 border-b border-gray-300">
                    <span className="text-sm font-medium text-secondary text-gray-600 whitespace-nowrap px-16">
                      Email
                    </span>
                    <span className="font-bold truncate px-16">
                      {data.email}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between width-full px-6 border-b border-gray-300">
                    {/* <!-- <span>Company</span> --> */}
                    <span className="text-sm font-medium text-gray-600 text-secondary whitespace-nowrap px-16">
                      Requested By
                    </span>
                    <span className="font-bold px-16">
                      {data.who === "my self" ? "Self" : "Agent"}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between width-full px-6">
                    {/* <!-- <span>Company</span> --> */}
                    <span className="text-sm font-medium text-gray-600 text-secondary whitespace-nowrap px-16">
                      Requested Date
                    </span>
                    <span className="font-bold px-16 ">{formattedDate}</span>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-24 ">
            {/* <!-- Stock --> */}
            <div className="flex flex-col bg-white  flex-auto bg-card shadow rounded-2xl overflow-hidden gap-y-8 col-span-2 md:col-span-1">
              <div className="flex items-start justify-between mx-10 pt-16 px-10">
                <div className="text-lg font-medium tracking-tight  leading-6 truncate">
                  Stock
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center px-10 mx-10">
                <div className="text-5xl font-bold tracking-tighter leading-tight">
                  {data.stock}
                </div>
              </div>
              <div className="flex flex-col flex-auto width-full ">
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300 mt-2 ">
                  <span className=" text-gray-600 ">Market Cap</span>
                  <span>
                    {data.market_cap.toLocaleString("en-US", {
                      minimumIntegerDigits: 1,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Share Price</span>
                  <span>
                    $
                    {data?.share_price?.toLocaleString("en-US", {
                      minimumIntegerDigits: 1,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }) | 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20">
                  {/* <!-- <span>Company</span> --> */}
                  <span className=" text-gray-600">{data.company}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white  flex-auto bg-card shadow rounded-2xl overflow-hidden  h-[300px] col-span-2 md:col-span-1">
              <div className="flex items-start justify-between p-16 m-6 mb-0">
                <div className="text-lg font-medium tracking-tight leading-6 truncate">
                  Calculations
                </div>
              </div>

              <div className="flex flex-col flex-auto width-full h-20">
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300 mt-2">
                  <span className=" text-gray-600">Max Risk Shares</span>
                  <span>
                    {data?.data?.calculations.max_risk_shares.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Max Risk Amount</span>
                  <span>
                    {data?.data?.calculations.max_risk_amount.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300 mt-2">
                  <span className=" text-gray-600">Current Company Rate</span>
                  <span>
                    {data?.data?.calculations.current_company_rate.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Estimated LTV</span>
                  <span>
                    {data?.data?.calculations.estimated_ltv.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Estimated Interest</span>
                  <span>
                    {data?.data?.calculations.estimated_interest.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                    %
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Money Exposure</span>
                  <span>
                    {data?.data?.calculations.money_exposure.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Term Multiplier</span>
                  <span>
                    {data?.data?.calculations.term_multiplier.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                    %
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Term Adjusted LTV</span>
                  <span>
                    {data?.data?.calculations.term_adjusted_ltv.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                    %
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Term Adjusted Rate</span>
                  <span>
                    {data?.data?.calculations.term_adjusted_rate.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                    %
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">
                    Adjusted Money Exposure
                  </span>
                  <span>
                    {data?.data?.calculations.adjusted_money_exposure.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
              </div>
            </div>
            {/* <!--Term Detail--> */}
            <div className="flex flex-col flex-auto bg-card shadow rounded-2xl bg-white overflow-hidden  h-[300px] col-span-2 md:col-span-1">
              <div className="flex items-start justify-between m-6 mb-0 p-20">
                <div className="text-lg font-medium tracking-tight leading-6 truncate">
                  Borro Term Detail
                </div>
              </div>
              <div className="flex flex-col flex-auto width-full h-20">
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300 mt-2">
                  <span className=" text-gray-600">Requested Shares</span>
                  <span>
                    {data?.data?.deal_terms.requested_shares.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Final stock price</span>
                  <span>
                    $
                    {data?.data?.deal_terms.final_stock_price.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300 mt-2">
                  <span className=" text-gray-600">Apprx Portfolio Value</span>
                  <span>
                    $
                    {data?.data?.deal_terms.approx_portfolio_value.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Auto seller premium</span>
                  <span>
                    {data?.data?.deal_terms.auto_seller_premium.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                    %
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Document fee</span>
                  <span>
                    $
                    {data?.data?.deal_terms.document_prep_fee.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Agent fee</span>
                  <span>
                    $
                    {data?.data?.deal_terms.origination_fee.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Net Proceeds</span>
                  <span>
                    $
                    {data?.data?.deal_terms.net_proceeds.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Term length</span>
                  
                    <span>
                      {data?.data?.deal_terms.term_table | 0}
                    </span>
                  
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Annual Interest Rate</span>
                  <span>
                    {data?.data?.deal_terms.final_interest_rate_yearly.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                    %
                  </span>
                </div>
                <div className="flex flex-row justify-between width-full px-20 border-b border-gray-300">
                  <span className=" text-gray-600">Annual Premium Amount</span>
                  <span>
                    $
                    {data?.data?.deal_terms.total_annual_premium.toLocaleString(
                      "en-US",
                      {
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    ) || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <TrendChart />
          </div>
          <div className="m-16 flex justify-center flex-col gap-24">
            <div className="inline-flex gap-20">
              <div className="bg-gray-600 p-10 rounded-full flex justify-center items-center">
                <DescriptionOutlinedIcon style={{ color: "white" }} />
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-md  ">
                  {data?.deal_activity[0].title}
                </span>
                <span className="text-sm text-gray font-semibold ">{date}</span>
              </div>
            </div>
            <div className="inline-flex gap-20">
              <div className="bg-gray-600 p-10 rounded-full flex justify-center items-center">
                <VerifiedUserOutlinedIcon style={{ color: "white" }} />
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-md">{data?.deal_activity[1].title}</span>
                <span className="text-sm text-gray font-semibold ">{date}</span>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default Details;
