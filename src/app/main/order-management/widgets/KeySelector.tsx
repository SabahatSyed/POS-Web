import React, { useState } from "react";
import { FormControlLabel, Checkbox, FormGroup } from "@mui/material";

const KeySelector:React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
    console.log(selectedKeys);
    
  const keys = [
    "id",
    "prep_center",
    "user",
    "received_by",
    "percentage_prepped",
    "order_list_id",
    "prep_center_id",
    "user_id",
    "order_date",
    "order_no",
    "order_type",
    "supplier",
    "tracking_info",
    "quantity_ordered",
    "asin",
    "image",
    "item_name",
    "manufacturer",
    "received_date",
    "quantity_received",
    "quantity_damaged",
    "rejected_reason",
    "received_by_id",
    "quantity_prepped",
    "cost_price",
    "sale_price",
    "status",
    "is_active",
    "date_added",
    "date_updated",
  ];

  const handleKeyChange = (key) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };

  return (
    <FormGroup>
      {keys.map((key) => (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              checked={selectedKeys.includes(key)}
              onChange={() => handleKeyChange(key)}
            />
          }
          label={key.replace(/_/g, " ").toUpperCase()}
        />
      ))}
      <p>Selected Keys: {selectedKeys.join(", ")}</p>
    </FormGroup>
  );
};

export default KeySelector;
