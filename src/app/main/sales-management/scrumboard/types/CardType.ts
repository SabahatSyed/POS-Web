import { ChecklistType } from './ChecklistType';
import { CommentsType } from './CommentType';
import { AttachmentType } from './AttachmentType';
import { ActivitiesType } from './ActivityType';

export type LabelId = string;

type MemberId = string;

/**
 * Card Type
 */
export type CardType = {
	id: string;
	boardId: string;
	listId: string;
	title: string;
	description: string;
	labels: LabelId[];
	dueDate: number;
	attachmentCoverId: string;
	memberIds: MemberId[];
	attachments: AttachmentType[];
	subscribed: boolean;
	checklists: ChecklistType[];
	// activities: CommentsType;

	name?: string;
	email?: string;
	transaction_type?: string;
	phone?: number;
	photoURL?: string;
	comments?: CommentsType;
	activities?: ActivitiesType
	stock?: string
	market_cap?: number,
	envelope_id?: string,
	accepted_date?: number
	company?: string
	share_price?: number
	deal_data?: string
};

/**
 * Cards Type
 */
export type CardsType = CardType[];
