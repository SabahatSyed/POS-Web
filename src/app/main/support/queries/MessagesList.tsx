import { motion } from 'framer-motion';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import { SyntheticEvent, useState } from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { MessageType  } from '../types/SupportTypes';
import { getRecords, addComment } from '../store/SupportSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch, useAppSelector } from 'app/store';
import { selectUserRole, selectUser } from 'app/store/user/userSlice';
import { useNavigate } from 'react-router';
import { Button, CircularProgress } from '@mui/material';
import FormDialog from 'app/shared-components/FormDialog';
// import { FaqsType } from '../types/FaqType';

const container = {
	show: {
		transition: {
			staggerChildren: 0.05
		}
	}
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

const StyledAccordion = styled(Accordion)(() => ({
	border: 'none!important',
	borderRadius: '8px!important',
	'&:before': {
		display: 'none'
	}
}));

type MessageListProps = {
	className?: string,
	list: MessageType[]
};

/**
 * The faq list component.
 */
function MessageList(props: MessageListProps) {
	const { list, className } = props;
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [msg, setMessage] = useState('');
	const [heading, setHeading] = useState('');
	const [loading, setLoading] = useState(false)
	const userRole = useAppSelector(selectUserRole);
	const [ messageId, setMessageId] = useState('');
	const user = useAppSelector(selectUser);

  // Function to open the dialog
  const openDialog = () => {
    setDialogOpen(true);
  };

  // Function to close the dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Function to handle confirmation (API call)
  const handleConfirm = async (id) => {
    try {
      // Perform your API call here using `fetch` or any other library
      // Example:
	  setLoading(true)
	  const payload = { message: msg, support_id: id }
      await dispatch(addComment({payload}))
					.then((resp: any) => {
						console.log(resp);
						if (resp.error) {
							dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
							setMessage('')
						}
						else {
							dispatch(showMessage({ message: 'Success', variant: 'success' }));
							// history.push(`/product/${resp.payload.product_id}`)
							dispatch(getRecords())
							setMessage('')
							console.log(document.getElementById('msg'))
						}
					});
    } catch (error) {
    }
	setLoading(false)

    closeDialog();
  };
	const [expanded, setExpanded] = useState<string | boolean>(false);

	const toggleAccordion = (panel: string) => (_: SyntheticEvent, _expanded: boolean) => {
		setExpanded(_expanded ? panel : false);
	};
	return (
		list?.length > 0 && (
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className={clsx('space-y-24', className)}
			>
				{list.map((message,index) => (
					<motion.div
						variants={item}
						key={index}
					>
						<StyledAccordion
							classes={{
								root: 'FaqPage-panel shadow'
							}}
							expanded={expanded === message.message_id}
							onChange={toggleAccordion(message.message_id)}
						>
							<AccordionSummary expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}>
								<div className="flex justify-between px-10 w-full">
									<div className="flex items-center py-4">
										{/* <FuseSvgIcon color="action">heroicons-outline:user-circle</FuseSvgIcon> */}
										<Typography className="px-12 font-bold" style={{ fontSize: '15px' }}>{message.title}</Typography>
									</div>
									{/* {userRole[0] === 'Admin' && !message.reply && */}
									{/* <Button
											className="whitespace-nowrap"
											variant="contained"
											color="secondary"
											onClick={() => {
												setMessageId(message.message_id)
												openDialog()
											}}
											startIcon={<FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>}
										>
											Reply
									</Button> */}
								{/* } */}
								</div>
							</AccordionSummary>

							<AccordionDetails sx={{ maxHeight: "300px", overflowY: "scroll" }}>
								{/* <div className="flex gap-8 py-4 items-center"> */}
								{/* <div className={user.uuid === message.sender_id  ? "flex gap-8 py-4 pr-8 items-center justify-end" : "flex gap-8 py-4 pr-8 items-center justify-start"}>
									<FuseSvgIcon color="action">heroicons-outline:user-circle</FuseSvgIcon>	
									<p>{message.sender}</p>
								</div> */}
								<div className='flex flex-col gap-6'>
									{/* <Typography className={"font-medium w-[50%] rounded-xl p-10 bg-[#D5E6E9] flex " + (user.uuid === message.sender_id ? " self-end justify-end ": " self-start justify-start")}>{message.message || ""}</Typography> */}
									{/* <Typography className={"font-medium flex " + (user.uuid === message.sender_id ? " justify-end pr-8": " justify-start pl-8")} style={{ fontSize: '11px' }}>{message.date}</Typography> */}

									<div className="flex flex-col">
										{message.comments.map((comment, index) => {
    										return (
                        								<div className="flex flex-col" key={index}>
															{/* <div className="flex gap-8 ml-20 py-4 items-center"> */}
															<div className={user.uuid === comment.added_by_id ? "flex gap-8 py-8 pr-8 items-center justify-end" : "flex gap-8 py-8 pl-8 items-center justify-start"}>
																<FuseSvgIcon color="action">heroicons-outline:user-circle</FuseSvgIcon>	
																<p>{comment.added_by}</p>
															</div>
															<div style={{width:"50%"}} className={user.uuid === comment.added_by_id ? "self-end" : undefined}>
																<Typography className={"font-medium rounded-xl p-10 bg-[#D5E6E9] flex " + (user.uuid === comment.added_by_id ? " justify-end " : " justify-start")} >{comment.message || ""}</Typography>
																<Typography className={"font-medium flex " + (user.uuid === comment.added_by_id ? " justify-end pr-8": " justify-start pl-8")} style={{ fontSize: '11px' }}>{comment.date}</Typography>
															</div>
                        								</div>
                     								 );
											})}
									</div>
								</div>
								
							</AccordionDetails>

							<AccordionSummary>
								<div className="flex justify-between w-full">
									<input className='w-[92%] border rounded p-10' type='text' value={msg} onChange={(e) => setMessage(e.target.value)} placeholder='Type a message'/>
									{/* {userRole[0] === 'Admin' && !message.reply && */}
									<Button
											className="whitespace-nowrap"
											variant="contained"
											color="secondary"
											onClick={() => {
												
												handleConfirm(message.message_id)
											}}
											startIcon={<FuseSvgIcon size={20} style = {{transform: 'rotate(90deg)', marginLeft: 15}}>heroicons-solid:paper-airplane</FuseSvgIcon>}
										>
											{loading && (
											<div className="ml-8 mt-2">
												<CircularProgress size={16} color="inherit"/>
											</div>
											)}
									</Button>
								{/* } */}
								</div>
							</AccordionSummary>
						</StyledAccordion>
					</motion.div>
				))}
				 <FormDialog
					open = {dialogOpen}
					onClose = {closeDialog}
					onConfirm = {handleConfirm}
					title = "Reply to User"
					content = {msg}
					setContent = {setMessage}
					// heading={heading}
					// setHeading={setHeading}
					loading = {loading}
					// messageId={messageId}
				/>
			</motion.div>
		)
	);
}

export default MessageList;
