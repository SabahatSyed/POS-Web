import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { MouseEventHandler, memo, useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAppDispatch, useAppSelector } from 'app/store';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { selectWidgets } from '../store/productsSlice';
import PreviousStatementWidgetType from '../types/PreviousStatementWidgetType';
import { Avatar, Box, Chip, CircularProgress, Input, Modal, TextField, Tooltip } from '@mui/material';
import history from '@history';
// import { showMessage } from 'app/store/fuse/messageSlice';
// import { addRecord, getSingleProduct } from '../../dashboards/store/productsSlice';
import { HistoryType } from '../types/ProductTypes';
import { useParams } from 'react-router';
import { addRecord } from '../store/productsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CreateOrderForm from '../../favourites/components/CreateOrderForm';

/**
 * The Product Info widget.
 */
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function ProductInfo({ data, quantity,onProductDetail=false ,setQuantity , lowBsr , highVolume }) {
  const [loading, setLoading] = useState(false);
  const [isFavourite, setIsFavourite] = useState(data?.is_favourite);
  const [comment, setComment] = useState(data?.note);
  const [buttonLoading, setIsButtonLoading] = useState("");
  const [open, setOpen] = useState(false);
  const [favouriteId, setIsFavouriteId] = useState(data?.favourite_id);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isTooltipTitle, setIsTooltipTitle] = useState(false);
  const [isTooltipUpc, setIsTooltipUpc] = useState(false);
  const { asin } = useParams();
  const dispatch = useAppDispatch();

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    // console.log("quantity increment ", quantity);
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity < 2 ? 1 : prevQuantity - 1));
    // console.log("quantity decrementt ", quantity);
  };
  const handleChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) {
      // Check if the input is not a valid number or less than 1
      setQuantity(1); // Set quantity to empty string
    } else {
      setQuantity(newQuantity); // Set quantity to the new value
    }
  };
  const handleCopyASIN = () => {
    navigator.clipboard.writeText(data?.data?.product_data.asin); // Copy ASIN value to clipboard
    setIsTooltipOpen(true); // Show tooltip
    setTimeout(() => setIsTooltipOpen(false), 2000); // Hide tooltip after 2 seconds
  };
  const handleCopyTitle = () => {
    navigator.clipboard.writeText(data?.data?.product_data.item_name); // Copy ASIN value to clipboard
    setIsTooltipTitle(true); // Show tooltip
    setTimeout(() => setIsTooltipTitle(false), 2000); // Hide tooltip after 2 seconds
  };

  const handleCopyUPC = () => {
    navigator.clipboard.writeText(data?.data?.product_data.upc); // Copy ASIN value to clipboard
    setIsTooltipUpc(true); // Show tooltip
    setTimeout(() => setIsTooltipUpc(false), 2000); // Hide tooltip after 2 seconds
  };

  const AddtoCart = async () => {
    // const formData = { product_id: asin , quantity: quantity};
    // Logic to handle the search, e.g., redirect to the search results page
    setLoading(true);
    if (isFavourite) {
      await axios
        .post("/api/favourites/remove_from_favourite", {
          favourite_id: favouriteId,
        })
        .then(() => {
          dispatch(
            showMessage({
              variant: "success",
              message: "Removed from favourites",
            })
          );
          // setComment('');
          setIsFavourite(false);
        });
    } else {
      await axios
        .post("/api/favourites/add_to_favourite", {
          product_id: data?.product_id,
          note: comment,
        })
        .then((res) => {
          dispatch(
            showMessage({ variant: "success", message: "Added to favourites" })
          );
          setIsFavouriteId(res.data.favourite_id);
          setIsFavourite(true);
        });
    }
    setLoading(false);
  };

  // console.log('ProductInfo', data);
  function convertToTitleCase(str) {
    const abbreviations = ["IP", "UI"]; // List of known abbreviations

    console.log(str);

    return str
      .split(/(?=[A-Z])/)
      .map((word) => {
        const upperWord = word.toUpperCase();
        if (abbreviations.includes(upperWord)) {
          return upperWord;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
  return (
    <Paper className="relative flex flex-col flex-auto sm:p-24 p-4 sm:pr-12 sm:pb-12 rounded-2xl shadow  w-full ">
      {data ? (
        <div className="h-full ">
          <div className="lg:flex  gap-10 ">
            <div className="lg:w-[35%] w-full  flex lg:flex-col lg:items-center gap-10 justify-between  ">
              <Avatar
                className=" lg:w-[60%] w-1/5 h-1/5 lg:h-max "
                alt="user photo"
                src={data?.data?.product_data?.image}
                sx={{ borderRadius: "0%" }}
              />
              <div className="flex gap-16 mb-10 ">
                <Tooltip
                  title={
                    <div className="p-5 flex flex-col gap-5">
                      <p className="font-600 ">Dimensions:</p>
                      <p>
                        <span className="font-600">Height: </span>
                        {data?.data?.product_data?.dimensions?.height?.value
                          ? data?.data?.product_data?.dimensions?.height?.value?.toFixed(2)
                          : 0}{" "}
                        {data?.data?.product_data?.dimensions?.height?.value
                          ? data?.data?.product_data?.dimensions?.height?.unit
                          : "inches "}
                      </p>
                      <p>
                        <span>Length: </span>
                        {data?.data?.product_data?.dimensions?.length?.value
                          ? data?.data?.product_data?.dimensions?.length?.value?.toFixed(2)
                          : 0}{" "}
                        {data?.data?.product_data?.dimensions?.length?.value
                          ? data?.data?.product_data?.dimensions?.length?.unit
                          : "inches "}
                      </p>
                      <p>
                        <span>Weight: </span>
                        {data?.data?.product_data?.dimensions?.weight?.value
                          ? data?.data?.product_data?.dimensions?.weight?.value?.toFixed(2)
                          : 0}{" "}
                        {data?.data?.product_data?.dimensions?.weight?.value
                          ? data?.data?.product_data?.dimensions?.weight?.unit
                          : "inches "}
                      </p>
                      <p>
                        <span>Width: </span>
                        {data?.data?.product_data?.dimensions?.width?.value
                          ? data?.data?.product_data?.dimensions?.width?.value?.toFixed(2)
                          : 0}{" "}
                        {data?.data?.product_data?.dimensions?.width?.value
                          ? data?.data?.product_data?.dimensions?.width?.unit
                          : "inches "}
                      </p>
                    </div>
                  }
                >
                  <div className="flex justify-center items-center border rounded-full border-gray-400 w-24 h-24 p-3 ">
                    <img
                      src="assets/images/apps/ecommerce/box1.svg"
                      alt="beach"
                      // style={{
                      // 	maxWidth: '640px',
                      // 	width: '100%'
                      // }}
                      className="rounded-6"
                    />
                  </div>
                </Tooltip>
                <Tooltip
                  title={
                    <div className="p-5 flex flex-col gap-5">
                      <p className="font-500 ">
                        Search for the product name on Amazon
                      </p>
                    </div>
                  }
                >
                  <Link
                    to={`https://www.amazon.com/dp/${data?.data?.product_data?.asin}/`}
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      color: "transparent",
                      border: "none",
                      background: "none",
                    }}
                  >
                    <div className=" flex  justify-center items-center border rounded-full border-gray-400 w-24 h-24 p-2 ">
                      <img
                        src="assets/images/apps/ecommerce/Amazon_1.svg"
                        alt="beach"
                        // style={{
                        // 	maxWidth: '640px',
                        // 	width: '100%'
                        // }}
                      />
                    </div>
                  </Link>
                </Tooltip>
                <Tooltip
                  title={
                    <div className="p-5 flex flex-col gap-5">
                      <p className="font-500 ">
                        Search for the product name on Google
                      </p>
                    </div>
                  }
                >
                  <Link
                    to={`https://www.google.com/search?q=${data?.data?.product_data?.item_name}`}
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      color: "transparent",
                      border: "none",
                      background: "none",
                    }}
                  >
                    <div className=" flex justify-center items-center border rounded-full border-gray-400 w-24 h-24 p-3 ">
                      <img
                        src="assets/images/apps/ecommerce/Google.svg"
                        alt="beach"
                        // style={{
                        // 	maxWidth: '640px',
                        // 	width: '100%'
                        // }}
                        className="rounded-6"
                      />
                    </div>
                  </Link>
                </Tooltip>
              </div>
            </div>
            <div className="w-full md:w-[75%] flex flex-col relative ">
              <Tooltip
                open={isTooltipTitle}
                onClose={() => setIsTooltipTitle(false)}
                title="Copied!"
                className="flex gap-5 items-center"
                placement="top"
              >
                <Typography
                  className="text-lg font-medium tracking-tight leading-6  wrap "
                  onClick={handleCopyTitle}
                >
                  {data?.data?.product_data?.item_name}
                </Typography>
                <FuseSvgIcon onClick={handleCopyTitle} className='cursor-pointer' size={14}>heroicons-outline:clipboard</FuseSvgIcon>
              </Tooltip>
              <Typography className="text-gray font-medium text-md">
                by {data?.data?.product_data?.manufacturer}{" "}
              </Typography>
              <div className="flex gap-6 py-4 sm:flex-row flex-col ">
                {/* Render green dots */}
                {data?.data?.product_data?.score_output &&
                  data?.data?.product_data?.score_output["Green Flags"] &&
                  data?.data?.product_data?.score_output["Green Flags"].map(
                    (flag, index) => (
                      <div key={index} className="flex flex-row" >
                        {/* {console.log("hyeee",flag)} */}
                        <Chip
                          label={convertToTitleCase(flag)}
                          className=" bg-borrowColor h-24 rounded-full px-3 text-center text-white text-xs font-semibold leading-none tracking-wide "
                          size="small"
                        />
                      </div>
                    )
                  )}

                {/* Render red dots */}
                {data?.data?.product_data?.score_output &&
                  data?.data?.product_data?.score_output["Red Flags"] &&
                  data?.data?.product_data?.score_output["Red Flags"].map(
                    (flag, index) => (
                      <div key={index} className="flex flex-row">
                        <Chip
                          label={convertToTitleCase(flag)}
                          className=" bg-equityColor h-24 rounded-full px-3 text-center text-xs text-white font-semibold leading-none tracking-wide "
                          size="small"
                        />
                      </div>
                    )
                  )}
              </div>
              {data?.data?.model_number && (
                <Typography className="text-gray font-medium text-sm">
                  Model Number: {data?.data?.product_data?.model_number}
                </Typography>
              )}
              <div className="flex flex-col flex-wrap mt-16 ">
                <div className="flex flex-col gap-4">
                  <Tooltip
                    open={isTooltipOpen}
                    onClose={() => setIsTooltipOpen(false)}
                    title="Copied!"
                    placement="top"
                  >
                    <Typography
                      onClick={handleCopyASIN}
                      className="text-color.secondary flex cursor-pointer font-medium text-md items-center gap-4 w-fit"
                    >
                      ASIN: {data?.data?.product_data?.asin}{" "}
                      <FuseSvgIcon size={14}>
                        heroicons-outline:clipboard
                      </FuseSvgIcon>
                    </Typography>
                  </Tooltip>
                  {data?.data?.product_data?.upc && (
                    <Tooltip
                      open={isTooltipUpc}
                      onClose={() => setIsTooltipUpc(false)}
                      title="Copied"
                      placement="top"
                    >
                      <Typography
                        className="text-color.secondary flex cursor-pointer font-medium text-md items-center gap-4 w-fit"
                        onClick={handleCopyUPC}
                      >
                        UPC: {data?.data?.product_data?.upc}{" "}
                        <FuseSvgIcon size={14}>
                          heroicons-outline:clipboard
                        </FuseSvgIcon>
                      </Typography>
                    </Tooltip>
                  )}

                  {/* <Typography className="mt-4 font-medium text-md leading-none">
									Quantity: 					
								</Typography> */}
                  <div className="flex flex-row">
                    {isFavourite ? (
                      <>
                        <div className="flex gap-10">
                          <div className="text-lg font-semibold tracking-tight leading-6  wrap ">
                            Note:
                          </div>
                          <div className="text-lg font-medium tracking-tight leading-6  wrap break-all  break-words line-clamp-2 ">
                            {comment}
                          </div>
                        </div>
                      </>
                    ) : (
                      <TextField
                        placeholder="Add comment"
                        disabled={isFavourite}
                        variant="outlined"
                        value={comment}
                        onChange={(e) => {
                          setComment(e.target.value);
                        }}
                      />
                    )}
                  </div>
                  <div className="flex gap-20 items-center">
                    <Button
                      disabled={loading}
                      className=" mt-8 rounded-lg w-fit"
                      variant="contained"
                      sx={{
                        background: "#0e505c",
                        color: "white",
                        ":hover": {
                          background: "#0e505c",
                        },
                      }}
                      startIcon={
                        isFavourite ? <StarIcon /> : <StarBorderIcon />
                      }
                      // disabled={_.isEmpty(dirtyFields) || !isValid}
                      onClick={() => AddtoCart()}
                    >
                      <span className="flex sm:self-end self-center text-xs sm:text-lg">
                        {isFavourite ? "Added" : "Add to Favorite"}
                      </span>
                      {loading && (
                        <div className="ml-8 mt-2">
                          <CircularProgress size={16} color="inherit" />
                        </div>
                      )}
                    </Button>
                    <Button
                      className="border-secondary hover:bg-white border-solid border-2 bg-white mt-8 rounded-lg w-fit text-xs sm:text-lg text-secondary flex items-center"
                      variant="contained"
                      // color="secondary"
                      onClick={() => setOpen(true)}
                      startIcon={
                        buttonLoading === "create" && loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <FuseSvgIcon color={"secondary"} size={20}>
                            heroicons-solid:plus
                          </FuseSvgIcon>
                        )
                      }
                    >
                      Create Order
                    </Button>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full md:w-4/5 gap-5 md:gap-2 flex-wrap md:flex-nowrap pr-4 md:pr-0 ">
                    <div>
                      <Typography className="text-color.secondary font-bold text-lg my-10 border-b-1 border-b-amber-900 text-center">
                        Eligible
                      </Typography>
                      <Typography className={`text-color.secondary font-medium text-lg text-center ${data?.data?.product_data?.eligible?"text-green-800":"text-amber-900"}`}>
                        {data?.data?.product_data?.eligible ? "True" : "False"}
                      </Typography>
                    </div>
                    <div >
                      <Typography className="text-color.secondary font-bold text-lg my-10 border-b-1 border-b-yellow-700 text-center flex gap-4 justify-center items-center">
                        BSR{" "}
                        <Tooltip
                          title={
                            <div className="flex flex-col text-white gap-10 font-500 p-5">
                              <p>BSR is a percentage value</p>
                            </div>
                          }
                        >
                          <FuseSvgIcon size={16} className=" text-gray-600">
                            heroicons-outline:information-circle
                          </FuseSvgIcon>
                        </Tooltip>
                      </Typography>
                      <Typography
                        className={`text-color.secondary font-medium text-lg text-center ${
                          lowBsr ? "text-green-800" : "text-red-700"
                        }`}
                      >
                        {new Intl.NumberFormat("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(data?.data?.product_data?.BSR)}
                        &nbsp;
                        <span
                          className={`ml-2 text-green-400 ${
                            lowBsr ? "text-green-800" : "text-red-700"
                          }`}
                        >
                          (
                          {new Intl.NumberFormat("en-US", {
                            notation: "compact",
                            compactDisplay: "short",
                          }).format(
                            Number(
                              Math.max(
                                1,
                                Math.round(data?.data?.listing_stats?.BSR_perc)
                              ).toFixed(0)
                            )
                          )}
                          %)
                        </span>
                      </Typography>
                    </div>
                    {/* <div>
                      <Typography className="text-color.secondary font-bold text-xl my-10 border-b-1 border-b-teal-200">
                        Alerts
                      </Typography>
                      <Typography className="text-color.secondary font-medium text-xl text-center text-teal-200">
                        {data.product_data.alerts}
                      </Typography>
                    </div> */}
                    {/* <div>
                                            <Typography className="text-color.secondary font-bold text-lg my-10 border-b-1 border-b-teal-500 text-center">
                                                Health
                                            </Typography>
                                            <Typography className="text-color.secondary font-medium text-lg text-center text-teal-500">
                                                {Math.round(data?.data?.product_data?.score_output && data?.data?.product_data?.score_output[
                                                    "Health Score"
                                                ] * 100)}%
                                            </Typography>
                                        </div> */}

                    <div >
                      <Typography className=" font-bold text-lg my-10 border-b-1 border-b-green-800 text-center">
                        Monthly Sold
                      </Typography>
                      <Typography
                        className={`${
                          highVolume ? "text-green-800" : "text-red-800"
                        } font-medium text-lg text-center  `}
                      >
                        {new Intl.NumberFormat("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(
                          Math.round(data?.data?.listing_stats?.sales_per_month)
                        ) || "N/A"}
                      </Typography>
                    </div>
                    <div>
                      <Typography className="text-color.secondary font-bold text-lg my-10 border-b-1 border-b-blue-300 text-center">
                        Multi-Pack
                      </Typography>
                      <Typography className="font-medium text-lg text-center text-blue-300">
                        {data?.data?.product_data?.multipack &&
                        data?.data?.product_data?.multipack > 1
                          ? `True (${data?.data?.product_data.multipack})`
                          : "False"}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* <div className="flex flex-col mt-2">
								<Typography className="mt-4 font-medium text-md leading-none">
									Size:  {data.size} ({data.color}), Style: {data.style}			
								</Typography>
							</div> */}
              </div>
              {/* <div className='flex justify-end pt-28 gap-16 pr-12'>
							<div className='rounded-full flex justify-center items-center border border-gray-400 w-48 h-48 bg-[#cecdcd]'>
								<img
									src="assets/images/apps/ecommerce/box1.svg"
									alt="beach"
									// style={{
									// 	maxWidth: '640px',
									// 	width: '100%'
									// }}
									className="rounded-6"
								/>
							</div>
							<div className='rounded-full flex justify-center items-center border border-gray-400 w-48 h-48 bg-[#cecdcd]'>
								<img
									src="assets/images/apps/ecommerce/box2.svg"
									alt="beach"
									// style={{
									// 	maxWidth: '640px',
									// 	width: '100%'
									// }}
									className="rounded-6"
								/>
							</div>
							<div className='rounded-full flex justify-center items-center border border-gray-400 w-48 h-48 bg-[#cecdcd]'>
								<img
									src="assets/images/apps/ecommerce/box3.svg"
									alt="beach"
									// style={{
									// 	maxWidth: '640px',
									// 	width: '100%'
									// }}
									className="rounded-6"
								/>
							</div>
							<div className='rounded-full flex justify-center items-center border border-gray-400 w-48 h-48 bg-[#cecdcd]'>
								<img
									src="assets/images/apps/ecommerce/G.svg"
									alt="beach"
									// style={{
									// 	maxWidth: '640px',
									// 	width: '100%'
									// }}
									className="rounded-6"
								/>
							</div>
							
						</div> */}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto">
          <CircularProgress size={16} color="inherit" />
        </div>
      )}
      <Modal
        keepMounted
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style} className="rounded-8 border-1 h-[90vh] w-[50vw]">
          <CreateOrderForm
            data={{
              ...data?.data?.product_data,
              cost_price: data?.data?.cost_of_goods,
              sale_price: data?.data?.product_data?.sale_price,
            }}
            handleClose={() => setOpen(false)}
            status={true}
            onProductDetail={true}
            // onDuplicate={true}
          />
        </Box>
      </Modal>
    </Paper>
  );
}

export default memo(ProductInfo);
