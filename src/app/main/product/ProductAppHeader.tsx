import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useParams } from 'react-router';
import { addRecord } from './store/productsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import history from '@history';
import { useAppDispatch } from 'app/store';
import { Box, CircularProgress, Modal } from '@mui/material';
import { useState } from 'react';
import ProductSearchBar from "../dashboards/widgets/ProductSearch"
import { getSingleProduct } from '../dashboards/store/productsSlice';
import CreateOrderForm from '../favourites/components/CreateOrderForm';
/**
 * The FinanceDashboardAppHeader component.
 */
function ProductAppHeader({setData,asin, data}) {

	const dispatch = useAppDispatch();
	const [loading,setLoading] = useState(false);
  const [buttonLoading, setIsButtonLoading] = useState("");
	const [open, setOpen] = useState(false);
	function handleRefresh() {
		setLoading(true);
    setIsButtonLoading('refresh');
		const formData={asin:asin}
		dispatch(getSingleProduct({asin:asin}))
		.then((resp: any) => {
			console.log(resp);
			setData(resp.payload)
			setLoading(false);
      setIsButtonLoading("");
			if (resp.error) {
				dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
			}
			else {
				history.push(`/product/${asin}`)
				setLoading(false);
        setIsButtonLoading("")				// dispatch(showMessage({ message: 'Success', variant: 'success' }));
			}
		})
	}
	return (
    <>
      <div className="flex w-full container">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
          <div className="flex flex-col flex-auto mb-10 w-2/5 justify-center">
            <Typography className="text-3xl font-semibold tracking-tight leading-8 ">
              Product Details
            </Typography>
            {/* <Typography
              className="font-medium tracking-tight"
              color="text.secondary"
            >
              {asin}
            </Typography> */}
          </div>
          <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12 w-[100%] ">
            <ProductSearchBar
              variant="basic"
              className="w-full relative"
              placeholder="Enter product name, ASIN, or UPC"
              navigation={[]}
            />

            <Button
              className={`
							mx-8 
								${loading ? "w-120 pointer-events-none opacity-70" : "w-120"}
							`}
              variant="contained"
              color="primary"
              startIcon={
                buttonLoading === "refresh" && loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <FuseSvgIcon size={20}>heroicons-solid:refresh</FuseSvgIcon>
                )
              }
              onClick={handleRefresh}
            >
              <span>{loading ? "Refresh" : "Refresh"}</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductAppHeader;
