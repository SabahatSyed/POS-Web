import { useAppDispatch } from "app/store";
import { useDebounce } from "@fuse/hooks";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBox";
import { SetStateAction, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

/**
 * The MultiSelectDropDown.
 */

type MultiSelectDropDownProps = {
  label?: string;
  dataSource?: any;
  selectedArray?: (items: any[]) => void;
  selectedItems?: string[];
  setSelectedItems?: SetStateAction<any>;
  setIsClear?:SetStateAction<boolean>;
  isClear?: boolean;
  setSelectedNames?: SetStateAction<any>;
  selectedItemNames?: any;
};

function MultiSelectDropDown(props: MultiSelectDropDownProps) {
  const {
    label,
    dataSource,
    setSelectedNames=()=>{},
    setIsClear,
    isClear=false,
    selectedArray,
    selectedItems: propSelectedItems,
    selectedItemNames: propSelectedNames,
    setSelectedItems,
  } = props;

  const dispatch = useAppDispatch();

  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItemsState] = useState<string[]>(
    propSelectedItems || []
  );
  console.log(selectedItems);
  
  const [selectedNames, setSelectedValues] = useState<string[]>(
    propSelectedNames || []
  );

  const fetchData = async (search?: string) => {
    const response = await dispatch(dataSource({ search: search }));
    setData(response.payload.records);
  };

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
    handleInputSearch(value);
  };

  const handleToggleItem = (item: any) => {
    const selectedIndex = selectedItems.indexOf(item.id);
    console.log(selectedItems);
    
    let newSelected: string[] = [];
    let selectedName: string[]=[];
    if (selectedIndex === -1) {
      newSelected = [...selectedItems, item.id];
      selectedName = [...selectedNames, item.name];
    } else {
      newSelected = selectedItems.filter(
        (id, index) => index !== selectedIndex
      );
      selectedName = selectedNames.filter(
        (id, index) => index !== selectedIndex
      );
    }

    setSelectedItemsState(newSelected);
    setSelectedValues(selectedName)
    if (selectedArray) {
      selectedArray(newSelected);
      setSelectedNames(selectedName)
    }
  };
useEffect(() => {
  if (isClear) {
    setSelectedItemsState([])
    setIsClear(false)
  }
}, [isClear]);
  return (
    <Autocomplete
      multiple
      value={selectedItems}
      onChange={(event, items: any) => {
        console.log(items);
        if(items.length===0){
          setSelectedValues([])
          setSelectedNames([])
        }
        setSelectedItemsState(items.map((item) => item.id));
        if (selectedArray) {
          selectedArray(items.map((item) => item.id));
        }
      }}
      options={data}
      renderTags={() => null}
      onInputChange={onInputSearch}
      getOptionLabel={(value: any) =>
        data.find((item) => item.id === value)?.name ||
        (typeof value === "object" ? value.name : "")
      }
      className="bg-white w-full sm:w-inherit sm:w-[20%] "
      isOptionEqualToValue={(item, value) => item?.id === value}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props} onClick={() => handleToggleItem(option)} className="mr-2 flex flex-row items-center justify-center">
          <Checkbox className="mr-1 md:mr-5 "
            icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="small" />}
            checkedIcon={<CheckBoxOutlinedIcon fontSize="small" />}
            // style={{ marginRight: 8 }}
            checked={selected}
          />
          <ListItemText primary={option.name} />
        </li>
      )}
    />
  );
}

export default MultiSelectDropDown;
