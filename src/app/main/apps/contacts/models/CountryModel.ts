import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { CountryType } from '../types/CountryType';
import FuseUtils from '@fuse/utils';

/**
 * The country model.
 */
const CountryModel = (data: PartialDeep<CountryType>) =>
	_.defaults(data || {}, {
		id: FuseUtils.generateGUID(),
		iso: '',
		name: '',
		code: '',
		flagImagePos: ''
	});

export default CountryModel;
