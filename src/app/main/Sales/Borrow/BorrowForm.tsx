import FuseExample from '@fuse/core/FuseExample';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppDispatch, useAppSelector } from 'app/store';
import SimpleFormPage from './BorrowForm/SimpleFormPage';
import { motion } from 'framer-motion';
/* eslint-disable import/no-webpack-loader-syntax, import/extensions, global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

/**
 * React Hook Form Doc
 * This document provides information on how to use React Hook Form.
 */
function UsersForm() {
	return (
		<>
			<div className="flex lg:w-full h-60 items-center justify-between bg-white mb-0  ">
				<Typography className='ml-20 h-20' variant="h5">Get a Quote today</Typography>
			</div>

			 {/* <FuseExample  
				className="max-w-full bg-grey-100 ml-10  mb-20"
				component={require('./BorrowForm/SimpleFormPage.tsx').default}
				// raw={require('!raw-loader!./UserForm/SimpleFormPage.tsx')}
	/>*/}
			 <div className="grid grid-cols-1 xl:grid-cols-3 bg-[#f8fafc] border border-b gap-32 lg:w-full w-full mt-32"> 
				<motion.div
					//variants={item}
					className="xl:col-span-2  lg:w-full flex flex-col flex-auto"
				>

					<SimpleFormPage />

				</motion.div>

			</div>
		</>
	);
}

export default UsersForm;
