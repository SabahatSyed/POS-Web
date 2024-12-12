import { Avatar, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import placedOrderIcon from "../assets/placedOrder.svg";
import preparedOrderIcon from "../assets/PreparedOrder.svg";
import orderReceivedIcon from "../assets/orderReceived.svg";
import { format } from "date-fns";

const Activities: React.FC = () => {
  const { id } = useParams();
  console.log(id);
  const [activityData, setActivityData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/order_list/fetch_activity_logs?order_list_id=${id}`
      );
      console.log(response);
      setActivityData(response.data.logs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="flex flex-col flex-auto mb-10">
        <div>
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            Activities
          </Typography>
          <Typography
            className="font-medium tracking-tight"
            color="text.secondary"
          >
            Keep track of your data
          </Typography>
        </div>
        <div className="text-left mt-20 flex flex-col gap-10 h-full overflow-y-auto" >
          {activityData.length > 0 ? (
            activityData.map((item) => {
              switch (item.activity_type) {
                case "Note Added": {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={preparedOrderIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                          <Typography className="font-400 text-[14px] mt-4">
                            {item.note}
                          </Typography>
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
                case "File Uploaded": {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={placedOrderIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
                case "Order Created": {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={placedOrderIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            className="text-lg"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
                case "Order Edited": {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={placedOrderIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            className="text-lg"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
                case "Order Received": {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={orderReceivedIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            className="text-lg"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
                case "Order Duplicated": {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={preparedOrderIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
                case "Order Confirmed": {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={preparedOrderIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
                case "Order Preparation Start": {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={preparedOrderIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
                case "Order Preparation Complete": {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={preparedOrderIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
                case "Note Deleted": {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={orderReceivedIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
                case "File Removed": {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={preparedOrderIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
                default: {
                  return (
                    <div
                      key={item.order_activity_log_id}
                      className="text-left flex w-full gap-10 pb-20 pt-3"
                    >
                      <Avatar alt={item.user} src={preparedOrderIcon} />
                      <div className="flex w-full justify-between">
                        <div className="w-[88%] flex flex-col justify-center">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                        <div className="font-300 w-[12%] md:text-[10px] lg:text-[12px]">
                          {format(new Date(item.date_added * 1000), "hh:mm a")}
                        </div>
                      </div>
                    </div>
                  );
                }
              }
            })
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
};

export default Activities;
