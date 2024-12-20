import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import jwtService from 'src/app/auth/services/jwtService';
import { useState } from 'react';
import history from '@history';
import { CircularProgress } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	password: yup
		.string()
		.required('Please enter your password.')
		.min(8, 'Password is too short - should be 8 chars minimum.'),
	passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
});

const defaultValues = {
	password: '',
	passwordConfirm: ''
};

/**
 * The full screen reset password page.
 */
function ResetPasswordPage() {
	const { control, formState, handleSubmit, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;
	const [loading, setLoading] = useState(false);
	const { token } = useParams();

	function onSubmit({ password }: yup.InferType<typeof schema>) {
		setLoading(true);

		jwtService
			.resetPassword(password, token)
			.then(() => {
				setLoading(false);
				history.push('/password-reset-success');
			})
			.catch((_errors: { type: 'token' | `root.${string}` | 'root'; message: string }[]) => {
				setLoading(false);
				_errors.forEach((error) => {
					setError('passwordConfirm', {
						type: 'manual',
						message: error.message
					});
				});
			});
	}

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Box
				className="bg-secondary relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112 w-1/2"
			>
				<svg
					className="pointer-events-none absolute inset-0"
					viewBox="0 0 960 540"
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMax slice"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Box
						component="g"
						sx={{ color: 'primary.light' }}
						className="opacity-20"
						fill="none"
						stroke="currentColor"
						strokeWidth="100"
					>
						<circle
							r="234"
							cx="196"
							cy="23"
						/>
						<circle
							r="234"
							cx="790"
							cy="491"
						/>
					</Box>
				</svg>
				<Box
					component="svg"
					className="absolute -right-64 -top-64 opacity-20"
					sx={{ color: 'primary.light' }}
					viewBox="0 0 220 192"
					width="220px"
					height="192px"
					fill="none"
				>
					<defs>
						<pattern
							id="837c3e70-6c3a-44e6-8854-cc48c737b659"
							x="0"
							y="0"
							width="20"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<rect
								x="0"
								y="0"
								width="4"
								height="4"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width="220"
						height="192"
						fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
					/>
				</Box>

				<div className="relative z-10 w-full max-w-2xl">
					<img src="/assets/images/pages/loginImage.webp" />
				</div>
			</Box>

			<Paper className="h-full w-full  px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-start md:rounded-none md:p-64 md:shadow-none">
				<div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-48"
						src="assets/images/logo/logo.png"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Reset your password
					</Typography>
					<Typography className="font-medium">Create a new password for your account</Typography>

					<form
						name="registerForm"
						noValidate
						className="mt-32 flex w-full flex-col justify-center"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Password"
									type="password"
									error={!!errors.password}
									helperText={errors?.password?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Controller
							name="passwordConfirm"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Password (Confirm)"
									type="password"
									error={!!errors.passwordConfirm}
									helperText={errors?.passwordConfirm?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Button
							variant="contained"
							color="secondary"
							className=" mt-4 w-full"
							aria-label="Register"
							disabled={_.isEmpty(dirtyFields) || !isValid || loading}
							type="submit"
							size="large"
						>
							Reset your password
							{loading && (
								<div className="ml-8 mt-2">
									<CircularProgress size={16} color="inherit" />
								</div>
							)}
						</Button>

						<Typography
							className="mt-32 text-md font-medium"
							color="text.secondary"
						>
							<span>Go to</span>
							<Link
								className="ml-4"
								to="/sign-in"
							>
								Sign in
							</Link>
						</Typography>
					</form>
				</div>
			</Paper>
		</div>
	);
}

export default ResetPasswordPage;
