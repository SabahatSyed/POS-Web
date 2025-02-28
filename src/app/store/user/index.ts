import { FuseSettingsConfigType } from "@fuse/core/FuseSettings/FuseSettings";

/**
 * The type definition for a user object.
 */
export type UserType = {
  uuid: string;
  role: string;
  name?: string;
  photoURL?: string;
  data: {
    name: string;
    displayName: string;
    photoURL?: string;
    email?: string;
    phone?: string;
    shortcuts?: string[];
    settings?: Partial<FuseSettingsConfigType>;
    pagesAccess?: any;
    theme?: any;
  };
  permissions: string[];
  loginRedirectUrl?: string;
  success?: boolean;
  theme?: any;
  message?: string;
};
