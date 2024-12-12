import axios from 'axios';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';

export type SettingJson = {
	api_call_limit_per_day: number;
	api_call_limit_per_minute: number;
};

export type SystemSettingType = {
	setting_id: string;
	setting_key: string;
	setting_json: SettingJson;
	is_active: boolean;
	date_added: number;
	date_updated: number;
};

export const getSystemSettings = createAppAsyncThunk('system-settings/getSystemSettings', async () => {
	const response = await axios.get(`/api/settings/`);
	const data = (await response.data) as SystemSettingType;
	return data;
});

