import { useAppDispatch, useAppSelector } from 'app/store';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { getRecords, selectMessages } from './store/SupportSlice';
import FusePageSimple from '@fuse/core/FusePageSimple';
// import { getFaqs, selectGroupedFaqs } from './store/faqsSlice';
// import { getFaqCategories } from './store/faqCategoriesSlice';
import MessageList from './queries/MessagesList';
import SupportHeader from './SupportHeader'
import { MessageType } from './types/SupportTypes';

/**
 * The help center faqs page.
 */
function ResourceCenterApp() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const groupedFaqs = useAppSelector(selectMessages);
	useEffect(() => {
		// dispatch(getFaqs());
		dispatch(getRecords());
	}, [dispatch]);

	const handleGoBack = () => {
		navigate(-1);
	};
	const content = (
				
				<div className='w-full px-24 md:px-32 pb-24'>
					<MessageList
						className="w-full mt-32"
						list={groupedFaqs.records as MessageType[]}
					/>
				</div>
				
	)
	return (
		<FusePageSimple
			header={<SupportHeader />}
			content={content}
		/>
	);
	
}

export default ResourceCenterApp;
