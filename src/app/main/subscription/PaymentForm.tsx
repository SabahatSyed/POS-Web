import { useEffect, useMemo, useState } from "react";
import _ from "@lodash";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "app/store";
import SubscriptionHeader from "./SubscriptionHeader";
import PreviousStatementWidget from "./widgets/PaymentMethodsTable";
import { useForm, Controller } from 'react-hook-form';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import { addRecord } from "./store/paymentsSlice";
import { dataSlice } from "../setting/store/settingSlice";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';
import { CircularProgress, InputLabel } from "@mui/material";
import history from "@history";
/*
 * The finance dashboard app.
 */
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
      border: "1px solid #ced4da", // Add border style here
      borderRadius: "4px",
    },
    invalid: {
      color: "#9e2146",
    },
  },
};
function PaymentForm({onClose}) {
  const dispatch = useDispatch<any>()
  const [loading,setLoading] = useState(false)
  const stripe = useStripe();
  const elements = useElements();
  const { handleSubmit, control, setValue, watch } = useForm();

  const onSubmit = async (data) => {
    // Handle your form submission here, including Stripe logic
    setLoading(true)
    try {
      // Check if stripe and elements are available
      if (!stripe || !elements) {
        console.error('Stripe.js has not loaded yet.');
        setLoading(false)
        return;
      }

      // Create a PaymentMethod using the card element
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: data.full_name,
        },
      });

      if (error) {
        console.error('Error creating PaymentMethod:', error);
        setLoading(false)

        // Handle error
      } else {
        const formData={ payment_method_id:paymentMethod.id,
        full_name:data.full_name}
        await dispatch(addRecord({ payload: formData }))
        .then((resp: any) => {
          setLoading(false)

          if (resp.error) {
            dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
          }
          else {
            dispatch(showMessage({ message: 'Success', variant: 'success' }));
            onClose && onClose()
          }
        });
        
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setLoading(false)
      // Handle other form submission errors
    }
  };
  const content = (
    <div className="w-full flex flex-col justify-center items-center my-auto">
      {/* <div
        className="w-full flex justify-center items-center flex-col "
       
      > */}
        {/* <div className=""> */}
		<img className="w-3/4" src="/assets/images/card.svg"></img>

		{/* </div> */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-3/4">
			<div className="flex flex-col gap-20 justify-around">
        <div className="flex flex-col gap-8"><InputLabel htmlFor="card_number">Card Number</InputLabel>
        <FormControl fullWidth >
        			<div className="p-16 rounded-6 border">
                <CardElement options={{
            hidePostalCode: true,
          }}/></div>
      	</FormControl>
        </div>
				<Controller
					name="full_name"
					control={control}
					render={({ field }) => (
          <div className="flex flex-col gap-8">
          <InputLabel htmlFor="full_name">Name on Card</InputLabel>
					<TextField
						{...field}
						className="focus:outline-none !outline-none"
						fullWidth
						required
					/>
          </div>
					)}
				/>
      

			<Button
				variant="contained"
				color="secondary"
				type="submit"
				disabled={!stripe || loading}
			>
				Save
        {loading && (
							<div className="ml-8 mt-2">
              <CircularProgress size={16} color="inherit" />
            </div>
						)}
			</Button>
			</div>

		</form>
		{/* <div className="">
		<img className="w-2/3 ml-auto" src="/assets/images/card.svg"></img>

		</div> */}
	{/* </div> */}
	</div>
  );

  return <FusePageSimple content={content} />;
}

export default PaymentForm;
