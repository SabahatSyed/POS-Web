import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { TagsType } from '../types/TagType';
import FuseUtils from '@fuse/utils';

/**
 * The tag model.
 */
const TagModel = (data: PartialDeep<TagsType>) =>
	_.defaults(data || {}, {
		id: FuseUtils.generateGUID(),
		title: ''
	});

export default TagModel;
