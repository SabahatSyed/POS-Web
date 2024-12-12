
import { useAppDispatch } from 'app/store';

import { useDebounce } from '@fuse/hooks';
import { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

/**
 * The DropdownWidget.
 */

type DropdownWidgetProps = {
    label: string,
    field: any;
    dataSource: any;
    errors: any;
};

function DropdownWidget(props: DropdownWidgetProps) {

    const label = props.label;
    const dataSource = props.dataSource;
    const field = props.field;
    const errors = props.errors;

    const dispatch = useAppDispatch();

    const [data, setData] = useState([])

	const fetchData = async (search?: string) => {
		const response = await dispatch(dataSource({search: search}));
		setData(response.payload.records);
	}

	useEffect(() => {

		fetchData();

	}, []);

    const handleInputSearch = useDebounce((value: string) => {
		if (value) {
			fetchData(value);
		} else {
			fetchData();
		}

	}, 300);

	const onInputSearch = (event, value, reason) => {
		// console.log('onInputSearch', value);
		handleInputSearch(value)
	};


    return (
		<Autocomplete
            {...field} 
            onChange={(event, item: any) => {
                field.onChange(item?._id);
            }}
            options={data}
            onInputChange={onInputSearch}
            getOptionLabel={(value: any) => (
                data.find(item => item._id === value)?.name || (typeof value === 'object' ? value.name : '')
            )}
            className='bg-white'
            isOptionEqualToValue={(item, value) => 
                item?._id === value
            }
            renderInput={(params) => (
                <TextField 
                    {...params}                     
                    label={label} 
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                    required
                    />
            )}
        />
	);
}

export default DropdownWidget;
