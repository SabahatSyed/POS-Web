import AppBar from '@mui/material/AppBar';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectFooterTheme } from 'app/store/fuse/settingsSlice';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import clsx from 'clsx';

type FooterLayout1Props = { className?: string };

/**
 * The footer layout 1.
 */
function FooterLayout1(props: FooterLayout1Props) {
	const { className } = props;

	const footerTheme = useSelector(selectFooterTheme);

	return (
		<ThemeProvider theme={footerTheme}>
			<AppBar
				id="fuse-footer"
				className={clsx('relative z-20 shadow-md', className)}
				color="default"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? footerTheme.palette.background.paper
							: footerTheme.palette.background.default
				}}
			>
				<Toolbar className="min-h-36 md:min-h-36 px-8 sm:px-12 py-0 flex items-center overflow-x-auto">
					<Typography className='w-full'>Copyright © 2023
							<Link
								className="ml-4"
								to="https://www.liqueous.com"
								color='secondary'
							>
								Liqueous
							</Link>

						</Typography>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default memo(FooterLayout1);
