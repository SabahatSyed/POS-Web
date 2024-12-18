import _ from '@lodash';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { Draggable } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from 'app/store';
import { AvatarGroup } from '@mui/material';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { MouseEvent, useEffect } from 'react';
import { openCardDialog } from '../../store/cardSlice';
import { selectCardById } from '../../store/cardsSlice';
import BoardCardLabel from './BoardCardLabel';
import { selectMembers } from '../../store/membersSlice';
import BoardCardDueDate from './BoardCardDueDate';
import BoardCardCheckItems from './BoardCardCheckItems';
import { selectBoard } from '../../store/boardSlice';
import { CardType } from '../../types/CardType';

const StyledCard = styled(Card)(({ theme }) => ({
	'& ': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	}
}));

type BoardCardProps = {
	cardId: string;
	index: number;
};

/**
 * The board card component.
 */
function BoardCard(props: BoardCardProps) {
	const { cardId, index } = props;

	const dispatch = useAppDispatch();
	const { data: board } = useAppSelector(selectBoard);
	const card = useAppSelector(selectCardById(cardId));
	const members = useAppSelector(selectMembers);

	// let commentsCount = getCommentsCount(card);
	// let cardCoverImage = _.find(card.attachments, { id: card.attachmentCoverId });

	let commentsCount = 0; // getCommentsCount(card);
	let cardCoverImage = null; //_.find(card.attachments, { id: card.attachmentCoverId });

	useEffect(() => {

		if (card) {
			commentsCount = getCommentsCount(card);
			cardCoverImage = _.find(card.attachments, { id: card.attachmentCoverId });
		}
	}, [card])

	function handleCardClick(ev: MouseEvent<HTMLDivElement>, _card: CardType) {
		ev.preventDefault();

		dispatch(openCardDialog(_card));
	}

	function getCommentsCount(_card: CardType) {
		return _.sum(_card.activities.map((x) => (x.type === 'comment' ? 1 : 0)));
	}

	if (!board) {
		return null;
	}

	return (
		<Draggable
			draggableId={cardId}
			index={index}
		>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					{/* <Link to={`/sales/details/${cardId}`}> */}
					<StyledCard
						className={clsx(
							snapshot.isDragging ? 'shadow-lg' : 'shadow',
							'w-full mb-12 rounded-lg cursor-pointer relative pl-2'
						)}
						onClick={(ev) => handleCardClick(ev, card)
						}
					>
						<div className={`absolute top-0 bottom-0 rounded-lg left-0 w-7 ${card?.transaction_type === 'BORRO' ? 'bg-borrowColor' : card?.transaction_type === 'Private Block Purchase' ? 'bg-privateBolckColor' : card?.transaction_type === 'Equity Lines of Credit' ? 'bg-equityColor' : ''}`} ></div>
						{board.settings.cardCoverImages && cardCoverImage && (
							<img
								className="block"
								src={cardCoverImage.src}
								alt="card cover"
							/>
						)}

						{card && (
							<>
								<div className="p-16 pb-0">
									<div className='flex items-center gap-8'>
										<Typography className={`font-medium text-sm ${card?.transaction_type === 'BORRO' ? 'text-borrowColor' : card?.transaction_type === 'Private Block Purchase' ? 'text-privateBolckColor' : card?.transaction_type === 'Equity Lines of Credit' ? 'text-equityColor' : ''}`}>{card?.transaction_type}</Typography>
										{card.labels.length > 0 && (
											<div className="flex flex-wrap -mx-4">
												{card.labels.map((id) => (
													<BoardCardLabel
														id={id}
														key={id}
													/>
												))}
											</div>
										)}
									</div>
									{/* <Typography className="font-medium mb-12">{card?.transaction_type}</Typography> */}

									{/* {(card.dueDate || card.checklists.length > 0) && (
								<div className="flex items-center mb-12 -mx-4">
									<BoardCardDueDate dueDate={card.dueDate} />

									<BoardCardCheckItems card={card} />
								</div>
							)} */}
									<Typography className="font-semibold my-16">{card?.name}</Typography>
									<div className='flex gap-10 mt-16 items-center'>
										<Typography className="text-sm font-medium">{card?.stock}</Typography>
										<Typography className="text-sm font-medium">{card?.company}</Typography>
									</div>
								</div>

								<div className="flex justify-between h-48 px-16">
									<div className="flex items-center space-x-4">
										{card?.subscribed && (
											<FuseSvgIcon
												size={16}
												color="action"
											>
												heroicons-outline:eye
											</FuseSvgIcon>
										)}

										{card.description !== '' && (
											<FuseSvgIcon
												size={16}
												color="action"
											>
												heroicons-outline:document-text
											</FuseSvgIcon>
										)}

										{card.attachments && (
											<span className="flex items-center space-x-2">
												<FuseSvgIcon
													size={16}
													color="action"
												>
													heroicons-outline:paper-clip
												</FuseSvgIcon>
												<Typography color="text.secondary">{card.attachments.length}</Typography>
											</span>
										)}
										{commentsCount > 0 && (
											<span className="flex items-center space-x-2">
												<FuseSvgIcon
													size={16}
													color="action"
												>
													heroicons-outline:chat
												</FuseSvgIcon>

												<Typography color="text.secondary">{commentsCount}</Typography>
											</span>
										)}
									</div>

									<div className="flex items-center justify-end space-x-12">
										{card.memberIds.length > 0 && (
											<div className="flex justify-start">
												<AvatarGroup
													max={3}
													classes={{ avatar: 'w-24 h-24 text-12' }}
												>
													{card.memberIds.map((id) => {
														const member = _.find(members, { id });
														return (
															<Tooltip
																title={member?.name}
																key={id}
															>
																<Avatar
																	key={index}
																	alt="member"
																	src={member?.avatar}
																/>
															</Tooltip>
														);
													})}
												</AvatarGroup>
											</div>
										)}
									</div>
								</div>

							</>
						)}


					</StyledCard>
					{/* </Link> */}
				</div>
			)}
		</Draggable>
	);
}

export default BoardCard;
