import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { ActivityType } from '../types/ActivityType';

/**
 * The Activity model.
 */
function ActivityModel(data: PartialDeep<ActivityType>): ActivityType {
    data = data || {};

    return _.defaults(data, {
        id: FuseUtils.generateGUID(),
        icon: 'heroicons-solid:star',
        date: Date.now(),
        description: '',
        type: 'other'
    });
}

export default ActivityModel;
