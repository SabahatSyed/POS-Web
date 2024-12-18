import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import jwtService from '../../auth/services/jwtService';
import { useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { CircularProgress } from '@mui/material';
import history from '@history';

/**
 * The user verification page.
 */
function UserVerificationPage() {
    const [loading, setLoading] = useState(false)
    const [showSuccessMsg, setShowSuccessMsg] = useState(false)
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    const handleVerifyClick = async () => {
        try {
            setLoading(true);
            const token = searchParams.get('token');
            const response = await jwtService.verifyAccount(token) as any;
            if (response.data.success) {
                dispatch(
                    showMessage({
                        message: 'Account verified successfully.',
                        autoHideDuration: 2000,
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },

                    })
                );
                setShowSuccessMsg(true)
            } else {
                dispatch(
                    showMessage({
                        message: 'Server error. Please try again.',
                        autoHideDuration: 2000,
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                    })
                );
            }
        } catch (error) {
            console.error('Error verifying account:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
            <Paper className="min-h-full w-full rounded-0 px-16 py-32 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow">
                <div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
                    <img
                        src="assets/images/logo/logo-full.png"
                        alt="logo"
                    />
                    <Typography className="mt-32 text-2xl text-center font-extrabold leading-tight tracking-tight">
                        Account Verification
                    </Typography>

                    <div className="mt-2 flex items-baseline font-medium">
                    </div>
                    <Button
                        variant="contained"
                        color="secondary"
                        className=" mt-16 w-full"
                        aria-label="Sign in"
                        type="submit"
                        size="large"
                        disabled={loading}
                        onClick={handleVerifyClick}
                    >
                        Verify
                        {loading && (
                            <div className="ml-8 mt-2">
                                <CircularProgress size={16} color="inherit" />
                            </div>
                        )}

                    </Button>

                    {showSuccessMsg && <Typography className="mt-14 flex justify-center font-medium text-base">
                        <span> Your Account is now Verified.</span>
                        <Link className='ml-4' to="/sign-in">Sign in</Link>
                    </Typography>}

                    <div className="mt-36 flex items-center align-middle font-medium">
                        <Typography className='w-full text-center'>Copyright © 2023
                            <Link
                                className="ml-4"
                                to=""
                                color='secondary'
                            >
                                Identify
                            </Link>

                        </Typography>
                    </div>

                </div>
            </Paper>
        </div>
    );
}

export default UserVerificationPage;
