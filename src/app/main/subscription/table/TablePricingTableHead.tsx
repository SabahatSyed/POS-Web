import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { TableDataItemType } from './TablePricingTable';
import { SubscriptionType } from '../types/SubscriptionType';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useDispatch, useSelector } from 'react-redux';
import { Unsubscribe, addRecord, getOrdersRecords } from '../store/orderSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useState } from 'react';
import ConfirmationDialog from '../../../shared-components/ConfirmationDialog';
import { selectPayments } from '../store/paymentsSlice';
import { useAppSelector } from 'app/store';
import history from '@history';
import { CircularProgress } from '@mui/material';
import { getInvoicesRecords } from '../store/InvoiceSlice';

type TablePricingTableHeadProps = {
	data?: any;
	payment_method_id?: string;
	period: string;
  sub_id: string;
};

/**
 * The table pricing table head component.
 */
function TablePricingTableHead(props: TablePricingTableHeadProps) {
	const dispatch = useDispatch<any>()
	const [loading,setLoading]=useState(false)
	const [dialogOpen, setDialogOpen] = useState(false);
	const paymentData = useAppSelector(selectPayments);
	const { period = 'month', data, payment_method_id, sub_id} = props;
	const {
    id,
    description,
    feature_01,
    feature_02,
    feature_03,
    feature_04,
    feature_05,
    feature_line,
    is_active,
    monthly_price,
    name,
    popular,
    subscription_id,
    title,
    trial_day,
    yearly_price,
    order_exists
  } = data;
  console.log("asd",sub_id,subscription_id)
	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	const handleConfirmDialog =() => {
    if(order_exists){
      unsubscribe()
    }
    else if(paymentData.count > 0) {
      subscribe()}
    else{
      dispatch(showMessage({ message: 'You need to configure Payment Method First', variant: 'warning' }))
      // setTimeout(()=>{
      //   history.push('paymentMethod')
      // },100)
    }
    
    handleCloseDialog();	

	};
  const unsubscribe=async()=>{
    setLoading(true)
		await dispatch(Unsubscribe())
        .then((resp: any) => {
          if (resp.error) {
            dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
            setLoading(false)
          }
          else {
            dispatch(showMessage({ message: 'Success', variant: 'success' }));
            setLoading(false)

          }
        });
    dispatch(getInvoicesRecords({id:null}));
    dispatch(getOrdersRecords({id:null}));
	}
  const subscribe=async()=>{
    setLoading(true)

		const formData={subscription_id,yearly:period=="month"?false:true,payment_method_id}
		await dispatch(addRecord({ payload: formData }))
        .then((resp: any) => {
          if (resp.error) {
            dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
            setLoading(false)
          }
          else {
            dispatch(showMessage({ message: 'Success', variant: 'success' }));
            setLoading(false)

          }
        });
    dispatch(getInvoicesRecords({id:null}));
    dispatch(getOrdersRecords({id:null}));
	}
	return (
    <Box className="flex flex-col" sx={{ backgroundColor: "background.paper" }}>
      <div className="flex justify-between">
        <div className='w-full'>
        {order_exists && sub_id == subscription_id && (
            <div
            className=" text-white w-full bg-green-900 py-2 items-center justify-center hidden h-24  text-center text-base font-semibold leading-none tracking-wide md:flex"
            >Selected</div>
          )}
        <div className="flex flex-col justify-center p-16 pt-12 lg:py-32">
        
          <div className="flex items-center justify-between">
            <div className='flex items-center'>
              <div className="text-xl font-medium lg:text-2xl">{name}</div>
                {popular && (
                  <Chip
                    label="POPULAR"
                    color="secondary"
                    className="mx-12 hidden h-24 rounded-full px-4 text-center text-sm font-semibold leading-none tracking-wide md:flex"
                    size="small"
                  />
                )}
                {monthly_price == 0 && yearly_price == 0 && (
                  <Chip
                    label="Free"
                    color="primary"
                    className="mx-12 hidden h-24 rounded-full px-4 text-center text-sm font-semibold leading-none tracking-wide md:flex"
                    size="small"
                  />
                )}
              </div>
              <div>
                {order_exists && sub_id === subscription_id && 
                  <Button
                    onClick={()=>setDialogOpen(true)}
                    className="my-12 w-full -mx-10"
                    variant={popular ? "contained" : "outlined"}
                    color={popular ? "error" : "inherit"}
                    disabled={loading}
                  >          
                    Unsubscribe
                    {loading && (
                        <div className="ml-8 mt-2">
                          <CircularProgress size={16} color="inherit" />
                        </div>
                      )}
                  </Button>
                  }
            </div>
        </div>
        <Typography
          className={`mt-4 text-sm lg:mt-12 lg:text-base line-clamp-3 ${order_exists?"h-[2em]":"h-[5em]"} overflow-hidden`}
          color="text.secondary"
        >
          {description}
        </Typography>
        <div className="flex items-baseline whitespace-nowrap lg:mt-16">
          <Typography className="text-lg" color="text.secondary">
            USD
          </Typography>
          <Typography className="text-2xl font-bold tracking-tight lg:mx-8 lg:text-4xl">
            {period === "month" && monthly_price}
            {period === "year" && yearly_price}
          </Typography>
          <Typography className="text-2xl" color="text.secondary">
            / month
          </Typography>
        </div>
        <Typography
          className="mt-4 text-sm lg:mt-12 lg:text-base"
          color="text.secondary"
        >
          {period === "month" && (
            <>
              billed monthly
              <br />
              <b>{yearly_price}</b> billed yearly
            </>
          )}
          {period === "year" && (
            <>
              billed yearly
              <br />
              <b>{monthly_price}</b> billed monthly
            </>
          )}
        </Typography>

          {!order_exists && 
          <Button
            onClick={()=>setDialogOpen(true)}
            className="my-12 h-32 min-h-32 w-full lg:my-24 lg:h-40 lg:min-h-40"
            variant={popular ? "contained" : "outlined"}
            color={popular ? "secondary" : "inherit"}
            disabled={loading}
          >          
            Get Started
            {loading && (
                <div className="ml-8 mt-2">
                  <CircularProgress size={16} color="inherit" />
                </div>
              )}
          </Button>}
          <div className="flex flex-col mt-4 gap-5">
            <div className="font-semibold">{feature_line}</div>
            <div className="mt-4 space-y-2">
              <FeatureItem text={feature_01} />
              <FeatureItem text={feature_02} />
              <FeatureItem text={feature_03} />
              <FeatureItem text={feature_04} />
              <FeatureItem text={feature_05} />
            </div>
          </div>

        </div>
        </div>
       
        <ConfirmationDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDialog}
          title="Confirmation"
          content="Are you sure you want to perform this action?"
        />	
        
      </div>
    </Box>
  );
}

const FeatureItem = ({ text }) => (
  <div className="flex gap-5">
    <FuseSvgIcon size={16} className="arrow-icon" style={{ color: 'green' }} >
      heroicons-solid:check
    </FuseSvgIcon>
    <div
      className="ml-2 leading-5"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  </div>
);
export default TablePricingTableHead;
