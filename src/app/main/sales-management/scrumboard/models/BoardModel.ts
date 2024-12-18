import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { CardType } from '../types/CardType';
import { BoardType } from '../types/BoardType';
import FuseUtils from '@fuse/utils';

export type CardIdsType = CardType['id'][];

/**
 * The board model.
 */
function BoardModel(data: PartialDeep<BoardType>): BoardType {
	data = data || {};

	return _.defaults(data, {
		id: FuseUtils.generateGUID(),
		title: 'Untitled',
		description: '',
		icon: 'heroicons-outline:template',
		lastActivity: new Date(),
		members: [],
		settings: {
			subscribed: true,
			cardCoverImages: true
		},
		lists: [],
		labels: []
	});
}

export default BoardModel;
