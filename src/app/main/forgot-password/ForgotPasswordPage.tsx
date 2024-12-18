import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import history from '@history';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import jwtService from 'src/app/auth/services/jwtService';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { getValue } from '@mui/system';

/**
 * Form Validation Schema
 */

/**
 * The full screen reversed forgot password page.
 */

const schema = yup.object().shape({
	email: yup.string().email('You must enter a valid email').required('You must enter a email')
});

const defaultValues = {
	email: ''
};
function ForgotPasswordPage() {
	const [searchParams] = useSearchParams()	
	const { control, formState, handleSubmit, setError, setValue, getValues} = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});
	const { isValid, errors } = formState;
	const [loading, setLoading] = useState(false);

	function onSubmit({ email }: yup.InferType<typeof schema>) {
		setLoading(true);

		jwtService
			.forgotPassword(email)
			.then(() => {
				setLoading(false);
				history.push('/reset-link-sent');
			})
			.catch((_errors: { type: 'email' | `root.${string}` | 'root'; message: string }[]) => {
				setLoading(false);
				_errors.forEach((error) => {
					setError(error.type, {
						type: 'manual',
						message: error.message
					});
				});
			});
	}

	useEffect(()=>{
		setValue('email', searchParams.get('email'))
		
	},[])
	return (
    <div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
      <Box
        sx={{
          background: "linear-gradient(240deg, #45D1EB 45%, #0e505c 100%)",
        }}
        className=" relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112 w-1/2"
      >
        <div className="relative z-10 w-full max-w-2xl">
          <img src="/assets/images/pages/cover-image.svg" />
        </div>
      </Box>

      <Paper className="h-full w-full  px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-start md:rounded-none md:p-64 md:shadow-none">
        <div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
          <img className="w-48" src="assets/images/logo/logo.png" alt="logo" />

          <Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
            Forgot password?
          </Typography>
          <div className="mt-2 flex items-baseline font-medium">
            <Typography>Fill the form to reset your password</Typography>
          </div>

          <form
            name="registerForm"
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
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
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
              disabled={getValues("email") == "" || !isValid || loading}
              type="submit"
              size="large"
            >
              Send reset link
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
              <span>Return to</span>
              <Link className="ml-4" to="/sign-in">
                Sign in
              </Link>
            </Typography>
          </form>
        </div>
      </Paper>
    </div>
  );
}

export default ForgotPasswordPage;
