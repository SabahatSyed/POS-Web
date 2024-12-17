import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { CardType } from '../types/CardType';
import FuseUtils from '@fuse/utils';

/**
 * The card model.
 */
function CardModel(data: PartialDeep<CardType>): CardType {
	data = data || {};

	return _.defaults(data, {
		id: FuseUtils.generateGUID(),
		boardId: '',
		listId: '',
		title: '',
		description: '',
		labels: [],
		dueDate: Math.floor(new Date().getTime()/1000) + 86400,
		attachmentCoverId: '',
		memberIds: [],
		attachments: [],
		subscribed: false,
		checklists: [],
		activities: []
	});
}
export default CardModel;
