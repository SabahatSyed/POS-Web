import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import { InferType } from 'yup';
import * as yup from 'yup';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { UserType } from 'app/store/user';
import jwtService from '../../auth/services/jwtService';
import { useAppDispatch } from 'app/store';
import { setUser } from 'app/store/user/userSlice';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	password: yup
		.string()
		.required('Please enter your password.')
		.min(4, 'Password is too short - must be at least 4 chars.'),
	remember: yup.boolean()
});

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

/**
 * The sign in page.
 */
function SignInPage() {
	const navigate= useNavigate()
	const dispatch = useAppDispatch();
	const { control, formState, handleSubmit, setError, setValue,  } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		setValue('email', 'admin@email.com', { shouldDirty: true, shouldValidate: true });
		setValue('password', '123456', { shouldDirty: true, shouldValidate: true });
	}, [setValue]);

	function onSubmit({ email, password }: InferType<typeof schema>) {
		// navigate('/dashboards/project');
		setLoading(true)
		jwtService
			.signInWithEmailAndPassword(email, password)
			.then((user: UserType) => {
				// eslint-disable-next-line no-console
				console.log("user",user);
				setLoading(false)
				dispatch(setUser(user))

				// No need to do anything, user data will be set at app/auth/AuthContext
			})
			.catch((_errors: { type: 'email' | 'password' | `root.${string}` | 'root'; message: string }[]) => {
				_errors?.forEach((error) => {
					setError(error.type, {
						type: 'manual',
						message: error.message
					});
					setLoading(false)
				});
			});
	}

	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center ">
			<Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full  md:rounded-none md:p-64 md:shadow-none">
				<div className="mx-auto w-full my-auto max-w-320 sm:mx-0 sm:w-320">
					

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Sign in
					</Typography>
					
					<form
						name="loginForm"
						noValidate
						className="mt-32 flex w-full flex-col justify-center"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Email"
									autoFocus
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

						<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
							{/* <Controller
								name="remember"
								control={control}
								render={({ field }) => (
									<FormControl>
										<FormControlLabel
											label="Remember me"
											control={
												<Checkbox
													size="small"
													{...field}
												/>
											}
										/>
									</FormControl>
								)}
							/> */}

							<Link
								className="text-md font-medium"
								to="/pages/auth/forgot-password"
							>
								Forgot password?
							</Link>
						</div>

						{loading ? 
						<CircularProgress size={24} className="mt-16 mx-auto" />
						: <Button
							variant="contained"
							color="secondary"
							className=" mt-16 w-full"
							aria-label="Sign in"
							loading={loading}
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							login
						</Button>}

						
					</form>
				</div>
			</Paper>

		</div>
	);
}

export default SignInPage;
