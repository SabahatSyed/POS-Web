import _ from '@lodash';
import { ListType } from '../types/ListType';
import FuseUtils from '@fuse/utils';

/**
 * The list model.
 */
function ListModel(data: Partial<ListType>): ListType {
	data = data || {};

	return _.defaults(data, {
		// id: _.uniqueId(),
		id: FuseUtils.generateGUID(),
		boardId: '',
		title: ''
	});
}

export default ListModel;
