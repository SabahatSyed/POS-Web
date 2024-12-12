import FuseExample from '@fuse/core/FuseExample';
import { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from 'app/store';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import BorrowdetailHeader from './BorrowdetailHeader';
/* eslint-disable import/no-webpack-loader-syntax, import/extensions, global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

/**
 * React Hook Form Doc
 * This document provides information on how to use React Hook Form.
 */
function EditForm() {
	const [tabValue, setTabValue] = useState(0);
	const content = (
		<div className="w-full px-24 md:px-32 pb-24">
			{useMemo(() => {
				const container = {
					show: {
						transition: {
							staggerChildren: 0.06
						}
					}
				};

				const item = {
					hidden: { opacity: 0, y: 20 },
					show: { opacity: 1, y: 0 }
				};

				return (
					!_.isEmpty() && (
						<motion.div
							className="w-full"
							variants={container}
							initial="hidden"
							animate="show"
						>
							<div className="grid grid-cols-1 xl:grid-cols-2 gap-32 w-full mt-32">
								<div className="grid gap-32 sm:grid-flow-col border border-t xl:grid-flow-row">
									<motion.div variants={item} className="flex flex-col flex-auto">
										
									</motion.div>

									{/* Add a small box with white background */}
									<motion.div variants={item} className="small-box"></motion.div>
								</div>
							</div>
						</motion.div>
						
						
	)
				);
}, [])}
		</div >
	);
return (
	<FusePageSimple
		header={<BorrowdetailHeader />}
		content={content}
	/>
);
}

export default EditForm;
