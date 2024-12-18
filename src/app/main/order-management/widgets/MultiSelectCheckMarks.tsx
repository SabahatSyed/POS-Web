import React, { SetStateAction, useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
};

interface MultiSelectProps {
  options: string[];
  label?: string;
  onChange: (selected: string[]) => void;
     setIsClear:SetStateAction<boolean>;
                isClear:boolean;
}

const MultiSelectCheckmarks: React.FC<MultiSelectProps> = ({
  options,
  onChange,
  label="",
  setIsClear,
  isClear=false,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;
    if (Array.isArray(value)) {
      setSelectedValues(value);
      onChange(value);
    } else {
      const selectedNames = value.split(",");
      setSelectedValues(selectedNames);
      onChange(selectedNames);
    }
  };
  useEffect(()=>{
    if(isClear){
      setSelectedValues([]);
      setIsClear(false);
    }
  },[isClear])

  return (
  
      <FormControl className='sm:w-[20%] w-full'>
         <InputLabel id="multi-select-checkbox-label">{label}</InputLabel>
        <Select
          labelId="multi-select-checkbox-label"
          id="multi-select-checkbox"
          multiple
          label={label}
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={selectedValues.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
        
</FormControl>

  );
};

export default MultiSelectCheckmarks;
