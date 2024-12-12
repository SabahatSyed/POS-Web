import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import authRoles from '../../auth/authRoles';
import UserVerificationPage from './userVerificationPage';

const UserVerificationPageConfig: FuseRouteConfigType = {
    settings: {
        layout: {
            config: {
                navbar: {
                    display: false
                },
                toolbar: {
                    display: false
                },
                footer: {
                    display: false
                },
                leftSidePanel: {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    auth: authRoles.user,
    routes: [
        {
            path: 'verify',
            element: <UserVerificationPage />
        }
    ]
};

export default UserVerificationPageConfig;
