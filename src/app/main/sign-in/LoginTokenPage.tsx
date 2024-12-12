import Typography from '@mui/material/Typography';
import { Link, useSearchParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import jwtService from 'src/app/auth/services/jwtService';
import { UserType } from 'app/store/user';
import history from '@history';


/**
 * The TokenSignInPage page.
 */
function LoginTokenPage() {

	const [searchParams, setSearchParams] = useSearchParams()
	const dispatch = useDispatch<any>()

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
const jwt_access_token = localStorage.getItem("jwt_access_token");
console.log(jwt_access_token);

	useEffect(() => {
		const asin = searchParams.get("asin");
		console.log(asin);
		
		if (jwt_access_token){
			
					history.push(`/create-order/${asin}`);

		}else{
			onSubmit();

		} 
		
	}, [dispatch])

	function onSubmit() {

		setLoading(true);

		const token = searchParams.get('token');
		const asin = searchParams.get("asin");
		const period = "";
		const subscription = "";
		console.log(asin);
		
		jwtService
			.signInWithOneTimeToken({token, period, subscription}, true)
			.then((user: UserType) => {
				setLoading(false);
				
				setTimeout(() => {
					console.log('LoginTokenPage redirect url', user.loginRedirectUrl);
					history.push(`/create-order/${asin}`)
						
				}, 100);

				// No need to do anything, user data will be set at app/auth/AuthContext
			})
			.catch((_errors: { type: 'email' | 'password' | `root.${string}` | 'root'; message: string }[]) => {
				setLoading(false);
				_errors.forEach((error) => {
					setError(error.message);
				});
			});
	}

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
			<Paper className="min-h-full w-full rounded-0 px-16 py-32 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow">
				<div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-48"
						src="assets/images/logo/logo.png"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Redirecting
					</Typography>
					<Typography className="mt-16">
						{/* some message here .... */}
						{error}
					</Typography>

					<Typography
						className="mt-32 text-md font-medium"
						color="text.secondary"
					>
						<span>Go to</span>
						<Link
							className="text-primary-500 ml-4 hover:underline"
							to="/sign-in"
						>
							sign in
						</Link>
					</Typography>
				</div>
			</Paper>
		</div>
	);
}

export default LoginTokenPage;
