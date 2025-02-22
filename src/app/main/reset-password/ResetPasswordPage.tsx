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
		<div className="flex w-full flex-auto flex-col items-center flex-row justify-center">
			

			<Paper className="h-full w-full  px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full  md:items-center md:justify-start md:rounded-none md:p-64 md:shadow-none">
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
