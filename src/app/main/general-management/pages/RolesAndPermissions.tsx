import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import UsersTable from "./UsersTable" 
import Roles from "./RolesTable"
/**
 * The RolesAndPermissions.
 */
function RolesAndPermissions() {
	const navigate = useNavigate();

	// const data = useAppSelector(selectRecords);

	
	return (
        <div className='h-fit'>
            <Roles/>
            <UsersTable/>
        </div>
	);
}

export default RolesAndPermissions;
