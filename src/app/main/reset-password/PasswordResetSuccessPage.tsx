import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';

/**
 * The page displayed after the password reset is successful.
 */
function PasswordResetSuccessPage() {
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
						Password Reset Successful
					</Typography>
					<Typography className="mt-16">
						Your password has been successfully reset. You can now sign in with your new password.
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

export default PasswordResetSuccessPage;
