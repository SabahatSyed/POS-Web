import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';

/**
 * The type definition for a user object.
 */
export type UserType = {
	uuid?: string;
	role?: string[] | string | null;
	permissions?: string[];
	from?: string;
	data: {
		displayName: string;
		photoURL?: string;
		email?: string;
		phone?: string;
		shortcuts?: string[];
		settings?: Partial<FuseSettingsConfigType>;
	};
};

export default UserType;
