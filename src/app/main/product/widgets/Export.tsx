import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useAppSelector } from "app/store";
import PreviousStatementWidgetType from "../types/PreviousStatementWidgetType";
import { CircularProgress, Input } from "@mui/material";
import history from "@history";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from "axios";

/**
 * The Export widget.
 */
function Export({ data, exportsheetdata, loadingExport }) {
  const [authenticate, setAuthenticate] = useState(null);
  const [loadingItem, setLoadingItem] = useState(null);
  const [addedItem, setAddedItem] = useState([]);
  const [sheetsData, setSheetsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingauth, setLoadingAuth] = useState(false);

  const authenticateUser = async () => {
    try {
      // Perform API call
      setLoadingAuth(true);
      const response = await axios.post("/api/google_sheets/authenticate");
      // Update state with response data
      if (response.data.authorization_url) {
        window.open(response.data.authorization_url, "_blank");
        setAuthenticate(response.data);
      }
      // setAuthenticate(response.data);
      // console.log(response.data);
    } catch (error) {
      // Handle errors
      setError(error);
    }
    // setLoadingAuth(false)
  };
  const sheets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/google_sheets/?page=${''}&limit=${''}&id=${''}&text=${''}`
      );
      setSheetsData(response?.data);
      // console.log("saira",response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleExportClick = async (googleSheetId, index) => {
    setLoadingItem(index);
    const res=await exportsheetdata(googleSheetId);
    setLoadingItem(null);
    if(res){
      setAddedItem((prevData) => [...prevData, index]);
    }
  };

  useEffect(() => {
    sheets();
  }, []);

  // const widgets = useAppSelector(selectWidgets);
  // const { status, date, limit, spent, minimum } = widgets.previousStatement as PreviousStatementWidgetType;
  // console.log("data",data)

  return (
    <Paper className="relative flex flex-col flex-auto pb-24 h-full shadow overflow-hidden">
      <div className="flex items-center p-24 justify-between mb-16 bg-[#D5E6E9]">
        <div className="flex flex-col gap-6">
          <Typography className="text-2xl font-bold tracking-tight leading-6 truncate text-secondary">
            Export
          </Typography>
         {sheetsData && sheetsData?.records?.length > 0 && (
            <div >
              <button
                onClick={() => {
                  authenticateUser();
                }}
                className={`border border-solid border-blue-300 rounded-md bg-secondary text-white px-6 py-2 flex justify-center items-center cursor-pointer ${
                  loadingauth ? "" : ""
                }`}
                type="submit"
                disabled={loadingauth}
              >
                Reconnect with Sheets
                {loadingauth && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                      width="30"
                      height="30"
                    >
                      <circle
                        fill="none"
                        strokeOpacity="1"
                        stroke="#9ECCFF"
                        strokeWidth=".5"
                        cx="100"
                        cy="100"
                        r="0"
                      >
                        <animate
                          attributeName="r"
                          calcMode="spline"
                          dur="1.8"
                          values="0;30"
                          keyTimes="0;1"
                          keySplines="0 .2 .5 1"
                          repeatCount="indefinite"
                        ></animate>
                        <animate
                          attributeName="stroke-width"
                          calcMode="spline"
                          dur="1.8"
                          values="0;25"
                          keyTimes="0;1"
                          keySplines="0 .2 .5 1"
                          repeatCount="indefinite"
                        ></animate>
                        <animate
                          attributeName="stroke-opacity"
                          calcMode="spline"
                          dur="1.8"
                          values="1;0"
                          keyTimes="0;1"
                          keySplines="0 .2 .5 1"
                          repeatCount="indefinite"
                        ></animate>
                      </circle>
                    </svg>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-60 min-w-60 shadow-md border-4 border-gray-300">
          Loading...
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              width="50"
              height="50"
              className="w-50 h-50 animate-spin"
            >
              <circle
                fill="none"
                strokeOpacity="1"
                stroke="#9ECCFF"
                strokeWidth=".5"
                cx="100"
                cy="100"
                r="0"
              >
                <animate
                  attributeName="r"
                  calcMode="spline"
                  dur="1.8"
                  values="1;80"
                  keyTimes="0;1"
                  keySplines="0 .2 .5 1"
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="stroke-width"
                  calcMode="spline"
                  dur="1.8"
                  values="0;25"
                  keyTimes="0;1"
                  keySplines="0 .2 .5 1"
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="stroke-opacity"
                  calcMode="spline"
                  dur="1.8"
                  values="1;0"
                  keyTimes="0;1"
                  keySplines="0 .2 .5 1"
                  repeatCount="indefinite"
                ></animate>
              </circle>
            </svg>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {sheetsData && sheetsData?.records?.length > 0 ? (
            sheetsData.records.map((item, index) => (
              <div className="flex items-center justify-center gap-6 py-4" key={index}>
                <div
                  className="flex flex-col w-[90%] items-center bg-white border border-secondary shadow-md rounded-md p-4 text-md cursor-pointer gap-10 hover:bg-blue-500 hover:bg-opacity-10  "
                  onClick={() => {
                    handleExportClick(item?.google_sheet_id, index);
                  }}
                >
                  <div className="flex-1 text-center ">
                    {item.google_sheet_name}
                    {addedItem.length > 0 && addedItem.includes(index) && (
                      <span style={{ marginLeft: "10px" }}>
                        <CheckCircleOutlineIcon
                          fontSize="small"
                          sx={{ color: "green" }}
                        />
                      </span>
                    )}
                    {loadingItem === index && loadingExport && (
                      <div className="ml-8 ">
                        <div className="flex justify-center items-center min-h-60 min-w-60 ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 200 200"
                            width="50"
                            height="50"
                          >
                            <circle
                              fill="none"
                              strokeOpacity="1"
                              stroke="#9ECCFF"
                              strokeWidth=".5"
                              cx="100"
                              cy="100"
                              r="0"
                            >
                              <animate
                                attributeName="r"
                                calcMode="spline"
                                dur="1.8"
                                values="1;80"
                                keyTimes="0;1"
                                keySplines="0 .2 .5 1"
                                repeatCount="indefinite"
                              ></animate>
                              <animate
                                attributeName="stroke-width"
                                calcMode="spline"
                                dur="1.8"
                                values="0;25"
                                keyTimes="0;1"
                                keySplines="0 .2 .5 1"
                                repeatCount="indefinite"
                              ></animate>
                              <animate
                                attributeName="stroke-opacity"
                                calcMode="spline"
                                dur="1.8"
                                values="1;0"
                                keyTimes="0;1"
                                keySplines="0 .2 .5 1"
                                repeatCount="indefinite"
                              ></animate>
                            </circle>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="w-full flex flex-col gap-2 justify-center text-center">
                No Sheets
              </div>
            </>
          )}
          
        </div>
      )}
    </Paper>
  );
}

export default memo(Export);
