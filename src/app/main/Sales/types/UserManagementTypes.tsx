type UserType = {
	_id: string;
	date: string;
	email?: string;
	name: string;
	amount: number;
	address?: string;
	phone?: string;
	role?: string;
  };
  
  export type RoleType = {
	_id: string;
	name: string;
	Checkbox?:boolean;
	permissions: string[];
  };
  
  type UserRecordsType = {
	records: {
	  columns: string[];
	  rows: UserType[];
	};
  };
  
  type RoleRecordsType = {
	records: {
	  columns: string[];
	  rows: RoleType[];
	};
	
  };
  type UserManagementTypes = {
	userRecordsType: UserRecordsType,
	roleRecordsType: RoleRecordsType
  };
  
  export default UserManagementTypes;
  