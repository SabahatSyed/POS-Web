import history from '@history';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import jwtService from '../../auth/services/jwtService';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	displayName: yup.string().required('You must enter display name'),
	email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	password: yup
		.string()
		.required('Please enter your password.')
		.min(8, 'Password is too short - should be 8 chars minimum.'),
	passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
	acceptTermsConditions: yup.boolean().oneOf([true], 'The terms and conditions must be accepted.')
});

const defaultValues = {
	displayName: '',
	email: '',
	password: '',
	passwordConfirm: '',
	acceptTermsConditions: false
};

/**
 * The sign up page.
 */
function SignUpPage({period, subscription}: {period: string, subscription: string}) {
	const { control, formState, handleSubmit, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;
	const [loading, setLoading] = useState(false);

	function onSubmit({ displayName, password, email }: typeof defaultValues) {

		setLoading(true);

		jwtService
			.createUser({
				displayName,
				password,
				email,
				period,
				subscription,
			})
			.then(() => {
				
				setLoading(false);
				history.push('/confirmation');
			})
			.catch((_errors: { type: 'email' | 'password' | `root.${string}` | 'root'; message: string }[]) => {
				setLoading(false);
				_errors.forEach(({ message, type }) => {
					setError(type, { type: 'manual', message });
				});
			});
	}

	return (
		// <div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
		// 	<div className="min-h-full w-full px-16 py-32 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:p-48 ">
				
		// 	</div>
		// </div>
		<div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
			<img
				className="w-48"
				src="assets/images/logo/logo.png"
				alt="logo"
			/>

			<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
				Sign up
			</Typography>
			<div className="mt-2 flex items-baseline font-medium">
				<Typography>Already have an account?</Typography>
				<Link
					className="ml-4"
					to="/sign-in"
				>
					Sign in
				</Link>
			</div>

			<form
				name="registerForm"
				noValidate
				className="mt-32 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					name="displayName"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Name"
							autoFocus
							type="name"
							error={!!errors.displayName}
							helperText={errors?.displayName?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Email"
							type="email"
							error={!!errors.email}
							helperText={errors?.email?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

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

				<Controller
					name="acceptTermsConditions"
					control={control}
					render={({ field }) => (
						<FormControl
							className="items-center"
							error={!!errors.acceptTermsConditions}
						>
							<FormControlLabel
								label={
									<span>
									I agree to the <Link to="https://www.identifysuite.com/terms-conditions/" target="_blank">Terms of Service</Link> and <Link to="https://www.identifysuite.com/privacy-policy/" target="_blank">Privacy Policy</Link>
									</span>
								}
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
							<FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
						</FormControl>
					)}
				/>

				<Button
					variant="contained"
					color="secondary"
					className=" mt-24 w-full"
					aria-label="Register"
					disabled={_.isEmpty(dirtyFields) || !isValid || loading}
					type="submit"
					size="large"
				>
					Create your free account
					{loading && (
						<div className="ml-8 mt-2">
							<CircularProgress size={16} color="inherit" />
						</div>
					)}
				</Button>
			</form>
		</div>
	);
}

export default SignUpPage;
