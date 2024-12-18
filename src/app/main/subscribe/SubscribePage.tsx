import history from '@history';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import jwtService from '../../auth/services/jwtService';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import SignUp from "./SignUpPage"
import PaymentMethodPage from "./PaymentMethodPage"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { DEFAULT_MIN_VERSION } from 'tls';
import { useAppSelector } from 'app/store';
import { getPublicSubscriptionRecords, selectSubscriptions } from '../subscription/store/subscriptionSlice';
import { useDispatch } from 'react-redux';
import { SubscriptionDataType, SubscriptionType } from '../subscription/types/SubscriptionType';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ToggleButton from './ToggleButton';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

function SubscribePage() {
	const dispatch = useDispatch<any>()
	const [step, setStep] = useState(0)
	const [user, setUser] = useState(null)

	const subscriptions = useAppSelector(selectSubscriptions) as SubscriptionDataType
	const subscription = "GX58D3JJQJ";
	const [period,setPeriod] = useState("month")

	const [data,setData] = useState<SubscriptionType>()
	useEffect(()=>{
		dispatch(getPublicSubscriptionRecords({id: null}))
	},[dispatch])

	useEffect(()=>{
		if(subscriptions && subscriptions?.records?.length > 0){
			setData(subscriptions.records.find((item)=>item.id == subscription))
		}
	},[subscriptions])

	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Box sx={{
				 background: "linear-gradient(240deg, #45D1EB 45%, #0e505c 100%)",
			}}
				className="relative hidden h-full  flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112 "
			>
				
				{data &&
					<div className="relative z-10 w-full max-w-sm">
						<ToggleButton selected={period} setSelected={setPeriod} />
						<Paper
							className='max-w-sm flex-col bg-white items-center p-32  text-center sm:px-40 sm:py-48 md:max-w-none lg:rounded-2xl '>
						<div className="text-3xl font-extrabold leading-tight text-[#525252] tracking-tight">
							{data.title} 
							</div>

						<div className="mt-20 flex items-baseline justify-center whitespace-nowrap">
							<Typography className="text-6xl text-[#525252] font-semibold leading-tight tracking-tight">
								$ {period === 'month' && data.monthly_price}
								{period === 'year' && (data.yearly_price * 12).toFixed(2)} 
							</Typography>							
							<Typography
								className="ml-8 text-2xl"
								color="text.primary"
							>
								/ {period}
							</Typography>
						</div>

						{period === 'year' && (<Typography
								className="ml-8 text-2xl"
								color="text.primary"
							>
								(${(data.yearly_price).toFixed(2)} / month )
							</Typography>
						)}

						<div className="mt-20 space-y-8">
						<div className="mt-36 flex flex-col text-[#525252]">
							<Typography className="text-start font-semibold text-[#525252]"
								dangerouslySetInnerHTML={{__html: data.feature_line}}
							/>
								{/* <div className="mt-16 space-y-8">
									<div className="flex">
										<FuseSvgIcon
											className="text-green-600"
											size={20}
										>
											heroicons-solid:check
										</FuseSvgIcon>
										<Typography className="ml-2 leading-5"
											dangerouslySetInnerHTML={{__html: data.feature_01}}
										/>
									</div>
									<div className="flex">
										<FuseSvgIcon
											className="text-green-600"
											size={20}
										>
											heroicons-solid:check
										</FuseSvgIcon>
										<Typography className="ml-2 leading-5"
											dangerouslySetInnerHTML={{__html: data.feature_02}}
										/>
									</div>
									<div className="flex">
										<FuseSvgIcon
											className="text-green-600"
											size={20}
										>
											heroicons-solid:check
										</FuseSvgIcon>
										<Typography className="ml-2 leading-5"
											dangerouslySetInnerHTML={{__html: data.feature_03}}
										/>
									</div>
									<div className="flex">
										<FuseSvgIcon
											className="text-green-600"
											size={20}
										>
											heroicons-solid:check
										</FuseSvgIcon>
										<Typography className="ml-2 leading-5"
											dangerouslySetInnerHTML={{__html: data.feature_04}}
										/>
									</div>
									<div className="flex">
										<FuseSvgIcon
											className="text-green-600"
											size={20}
										>
											heroicons-solid:check
										</FuseSvgIcon>
										<Typography className="ml-2 leading-5"
											dangerouslySetInnerHTML={{__html: data.feature_05}}
										/>
									</div>
								</div> */}
								<div className="mt-16 space-y-8">
								<div className="flex">
									<FuseSvgIcon className="text-green-600" size={20}>
									heroicons-solid:check
									</FuseSvgIcon>
									<Typography className="ml-2 leading-5">
									3 mobile app installs
									</Typography>
								</div>
								<div className="flex">
									<FuseSvgIcon className="text-green-600" size={20}>
									heroicons-solid:check
									</FuseSvgIcon>
									<Typography className="ml-2 leading-5">
									5 Chrome extension installs
									</Typography>
								</div>
								<div>
									<div className="flex ">
									<FuseSvgIcon className="text-green-600" size={20}>
										heroicons-solid:check
									</FuseSvgIcon>
									<Typography className="ml-2 leading-5">
										Unlimited product analysis
									</Typography>
									</div>
									<div className="text-left ml-24">
									<li>100% accurate monthly sales data</li>
									<li>Simplified price, offers, & BSR graphs</li>
									<li>Quick view of all variations on a listing</li>
									<li>
										Storefront stalking to find the best ASINs
									</li>
									<li>Red & green flags for all ASINs you view</li>
									</div>
								</div>
								<div className="flex">
									<FuseSvgIcon className="text-green-600" size={20}>
									heroicons-solid:check
									</FuseSvgIcon>
									<Typography className="ml-2 leading-5">
									Order management dashboard
									</Typography>
								</div>
								<div className="flex">
									<FuseSvgIcon className="text-green-600" size={20}>
									heroicons-solid:check
									</FuseSvgIcon>
									<Typography className="ml-2 leading-5">
									Favorite leads list
									</Typography>
								</div>
								<div className="flex">
									<FuseSvgIcon className="text-green-600" size={20}>
									heroicons-solid:check
									</FuseSvgIcon>
									<Typography className="ml-2 leading-5">
									{period === "month"
										? " FREE 7-day trial, then billed monthly"
										: " FREE 7-day trial, then billed annually"}
									</Typography>
								</div>
								</div>
							</div>
						</div>

						
					</Paper>
					</div>
				}
			</Box>
			<Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-start md:rounded-none md:p-64 md:shadow-none">
				<div className="mx-auto w-full sm:mx-0 ">			
					<SignUp period={period} subscription={subscription}/>
				</div>
			</Paper>
		</div>
	);
}

export default SubscribePage;
