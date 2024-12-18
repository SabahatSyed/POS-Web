import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { InferType } from 'yup';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect, useState } from 'react';
import { UserType } from 'app/store/user';
import jwtService from '../../auth/services/jwtService';

import PhoneInput from 'react-phone-input-2'
import { CircularProgress } from '@mui/material';

import { firebaseApp } from 'src/app/auth/firebase';
import { GoogleLogin, useGoogleLogin, googleLogout } from '@react-oauth/google';
import {
	ConfirmationResult,
	getAuth,
	RecaptchaVerifier,
	signInWithPhoneNumber,
} from "firebase/auth";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	phone: yup.string().required('You must enter a phone'),
});

const schema2 = yup.object().shape({
	otp: yup.string().required('You must enter an otp'),
});


const defaultValues = {
	phone: '',
};

const defaultValues2 = {
	otp: '',
};

/**
 * The sign in page.
 */
function SignInPage() {

	const [otpVisible, setOtpVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);

	const auth = getAuth(firebaseApp);
	const [otpVerifier, setOtpVerifier] = useState<null | ConfirmationResult>(null);

	const formPhone = useForm({
		mode: 'onChange',
		defaultValues: defaultValues,
		resolver: yupResolver(schema)
	});

	const formOtp = useForm({
		mode: 'onChange',
		defaultValues: defaultValues2,
		resolver: yupResolver(schema2)
	});

	useEffect(() => {
		formPhone.setValue('phone', '16505550001', { shouldDirty: true, shouldValidate: true });
	}, [formPhone.setValue]);

	function onSubmitPhone({ phone }: InferType<typeof schema>) {
		// console.log('phone: ', phone);
		setLoading(true);

		const phoneNo = `+${phone}`;

		jwtService
			.validatePhoneNumebr(phoneNo)
			.then((user: UserType) => {
				// setLoading(false);
				setUser(user);
				
				// setOtpVisible(true);
				sendFirebaseOTP(phoneNo, () => {

				});
			})
			.catch((_errors: { type: 'phone' | `root.${string}` | 'root'; message: string }[]) => {
				setLoading(false);
				_errors?.forEach((error) => {
					formPhone.setError(error.type, {
						type: 'manual',
						message: error.message
					});
				});
			});
	}

	function onResendOtp() {
		setLoading(false);
		formOtp.reset();

		const payload = formPhone.getValues();
		const phone = `${payload.phone}`;
		console.log('resend otp', phone);

		sendFirebaseOTP(phone, () => {
			// setTimeout(() => {
			// 	const elementToScrollTo = document.getElementById("enter-otp");
			// 	if (elementToScrollTo) {
			// 		elementToScrollTo.scrollIntoView({ behavior: "smooth" });
			// 	}
			// }, 500);
		});
	}


	function onSubmitOtp({ otp }: InferType<typeof schema2>) {
		console.log('otp: ', otp);
		setLoading(true);

		verifyOtpVerificationCode(otp, (idToken?: string) => {
			console.log('idToken: ', idToken);

			// call backend api now to login with id token
			jwtService
			.signInWithIdToken(idToken)
			.then((user: UserType) => {
				setLoading(false);

				// No need to do anything, user data will be set at app/auth/AuthContext
			})
			.catch((_errors: { type: 'token' | `root.${string}` | 'root'; message: string }[]) => {
				setLoading(false);
				_errors?.forEach((error) => {
					formOtp.setError('otp', {
						type: 'manual',
						message: error.message
					});
				});
			});
		});
	}

	function onBackToPhoneInput() {
		setOtpVisible(false);
		setUser(null);
		formOtp.reset();
		document.getElementById("recaptcha-container")?.remove();
	}

	const sendFirebaseOTP = (phone: string, callback: { (): void; (): void }) => {

		document.getElementById("recaptcha-container")?.remove();
		
		// Create a container for reCAPTCHA
		const recaptchaContainer = document.createElement("div");
		recaptchaContainer.id = "recaptcha-container";
		document.body.appendChild(recaptchaContainer);
		// console.log("recaptchaContainer", recaptchaContainer);
		// Initialize reCAPTCHA
		const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, {
			size: "invisible",
		});
		// console.log("RecaptchaVerifier initialized");

		// Initialize reCAPTCHA silently (no user response callback)
		recaptchaVerifier.render().then(() => {
			// console.log("ReCAPTCHA rendered successfully");

			// Now reCAPTCHA is silently solving the challenge.
			// You can proceed with sending the OTP or your desired action here.
			// For example, call `signInWithPhoneNumber` here.
			signInWithPhoneNumber(auth, phone, recaptchaVerifier)
				.then((confirmationResult) => {
					// console.log("SMS verification code sent:", confirmationResult);

					setLoading(false);
					setOtpVisible(true);

					setOtpVerifier(confirmationResult);
					// setShowPassword(true);

					callback();
				})
				.catch((error) => {
					setLoading(false);
					if (!otpVisible) {
						formPhone.setError('phone', {
							type: 'manual',
							message: error.message
						});
					}
					else {
						formOtp.setError('otp', {
							type: 'manual',
							message: error.message
						});	
					}

					// console.error("Failed to send SMS verification code:", error);
					// console.error("Error code: ", error.code);
					// console.error("Error message: ", error.message);
					// setConfirmationResult("Error");
					// setFirebaseError("Failed to send SMS verification code:" + error);
				});
		});
	};

	const verifyOtpVerificationCode = (code: string, callback: { (idToken?: string): void; (): void }) => {
		otpVerifier
		.confirm(code)
		.then((result: any) => {
			console.log("after otp verification", result);

			// const user = result.user;
			// console.log("User object from verify otp ", user);

			document.getElementById("recaptcha-container")?.remove();
			
			callback(result._tokenResponse.idToken);
		})
		.catch((error: any) => {
			setLoading(false);
			formOtp.setError('otp', {
				type: 'manual',
				message: error.message
			});
		});
	}


	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
			<Paper className="min-h-full w-full rounded-0 px-16 py-32 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow">
				<div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						src="assets/images/logo/logo-full.png"
						alt="logo"
					/>

					{!otpVisible  && (
						<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Sign in
						</Typography>
					)}

					{otpVisible  && (
						<>
							<Link className="mt-12 flex font-medium" to='#' onClick={onBackToPhoneInput}>
								<FuseSvgIcon className="mt-2 text-48" size={16} color="primary">heroicons-outline:arrow-left</FuseSvgIcon>
								<Typography className="ml-4" > Back </Typography>
							</Link>
							<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
								Welcome Back!
							</Typography>
							{user && (
							<Typography className="mt-16 text-lg font-semibold leading-tight tracking-tight">
								{user?.data.displayName}
							</Typography>
							)}
						</>
					)}

					<div className="mt-2 flex items-baseline font-medium">
						{/* <Typography>Don't have an account?</Typography>
						<Link
							className="ml-4"
							to="/sign-up"
						>
							Sign up
						</Link> */}
					</div>
					
					{!otpVisible && (
						<form
							name="loginForm"
							noValidate
							className="mt-32 flex w-full flex-col justify-center"
							onSubmit={formPhone.handleSubmit(onSubmitPhone)}
						>	

							<Typography className="font-bold mb-12">Phone Number</Typography>

							<div className="mb-24 w-full">
								<Controller
									name="phone"
									control={formPhone.control}
									render={({ field: { ref, ...field } }) => (
										<PhoneInput
											{...field}											
											inputStyle={{												
												width: '100% !important',
												padding: '16.5px 14px 16.5px 58px; !important',
											}}
											inputProps={{
												ref,
												required: true,
												autoFocus: true
											}}
											isValid={(value, country) => {
												return formPhone.formState.isValid;
											}}									
											specialLabel={""}
											country={'us'}
											/>									
									)}
								/>
								{formPhone.formState.errors.phone && (
									<p style={{
										color: '#f44336',
										fontWeight: 400,
										fontSize: '1.2rem',
										lineHeight: 1.66,
										textAlign: 'left',
										marginTop: '3px',
										marginRight: '14px',
										marginBottom: 0,
										marginLeft: '14px',
									}}>{formPhone.formState.errors.phone?.message}</p>
								)}

							</div>						

							<Button
								variant="contained"
								color="secondary"
								className=" mt-16 w-full"
								aria-label="Sign in"
								disabled={_.isEmpty(formPhone.formState.dirtyFields) || !formPhone.formState.isValid || loading}
								type="submit"
								size="large"
							>
								Sign in
								{loading && (
									<div className="ml-8 mt-2">
										<CircularProgress size={16} color="inherit" />
									</div>
								)}

							</Button>						
						</form>
					)}
					

					{otpVisible && (
						<form
							name="otpForm"
							noValidate
							className="mt-32 flex w-full flex-col justify-center"
							onSubmit={formOtp.handleSubmit(onSubmitOtp)}
						>	

							<Typography className="font-bold mb-12">One Time Password</Typography>

							<div className="mb-24 w-full">

								<Controller
									name="otp"
									control={formOtp.control}
									render={({ field }) => (
										<TextField
											{...field}
											className="mb-4"
											label="Enter OTP"
											type="text"
											error={!!formOtp.formState.errors.otp}
											helperText={formOtp.formState.errors?.otp?.message}
											variant="outlined"
											autoFocus={true}
											required
											fullWidth
										/>
									)}
								/>
								
							</div>	

							<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">

								<Typography 
									className="font-bold mb-24"
									>
									OTP Not Received? 
									<Link className="ml-8" to='#' color='secondary' onClick={onResendOtp}>Resend</Link>
								</Typography>

							</div>					

							<Button
								variant="contained"
								color="secondary"
								className=" mt-16 w-full"
								aria-label="Submit"
								disabled={_.isEmpty(formOtp.formState.dirtyFields) || !formOtp.formState.isValid || loading}
								type="submit"
								size="large"
							>
								Submit
								{loading && (
									<div className="ml-8 mt-2">
										<CircularProgress size={16} color="inherit" />
									</div>
								)}
							</Button>						
						</form>
					)}

					<div className="mt-36 flex items-center align-middle font-medium">
						<Typography className='w-full text-center'>Copyright © 2023
							<Link
								className="ml-4"
								to="https://www.liqueous.com"
								color='secondary'
							>
								Liqueous
							</Link>

						</Typography>
					</div>
					
				</div>
			</Paper>
		</div>
	);
}

export default SignInPage;
