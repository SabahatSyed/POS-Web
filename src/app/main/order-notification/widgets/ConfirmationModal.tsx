import { Modal, TextareaAutosize } from "@mui/base";
import { Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { SetStateAction } from "react";

interface ConfirmationModalProps {
  title?: string;
  open?: boolean;
  loading?: boolean;
  onClose: () => void;
  setLoading: SetStateAction<any>;
  type?: "delete";
  onConfirm: () => void;
  setReason?: SetStateAction<any>;
  setOtherReason?: SetStateAction<any>;
  reason?: string;
  otherReason?: string;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "max-content",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 6,
};
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title = "",
  type = "Confirm",
  open = false,
  loading = false,
  onClose = () => {},
  onConfirm = () => {},
  setReason, 
  setOtherReason, 
  reason, 
  otherReason
}) => {

 
  return (
    <Box sx={style} className="rounded-8 border-1 flex flex-col gap-36">
      <Typography className="font-semibold text-[26px] text-secondary">
        {title}
      </Typography>
      {type == 'delete' && <FormControl component="fieldset">
      <RadioGroup
        aria-label="reason"
        name="reason"
        value={reason}
        onChange={(e)=>setReason(e.target.value)}
      >
        <FormControlLabel value="Wrong Prep Center" control={<Radio />} label="Wrong Prep Center" />
        <FormControlLabel value="Not Enough Space" control={<Radio />} label="Don't have enough space" />
        <FormControlLabel value="Others" control={<Radio />} label="Others" />
      </RadioGroup>
      <TextareaAutosize
          aria-label="Specify Others"
          minRows={3}
          placeholder="Specify Others"
          style={{ width: '100%', marginTop:10, borderWidth:1, borderRadius:10, borderColor:'black', padding:10 }}
          value={otherReason}
          onChange={(e)=>setOtherReason(e.target.value)}
        />      
    </FormControl>}
      <div className=" justify-end w-full flex gap-20">
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
          }}
          variant="contained"
          color="secondary"
        >
          {type === "delete" ? "Reject" : "Confirm"}
          {loading && (
            <div className="ml-6 inline-flex items-center">
              <CircularProgress size={16} color="inherit" />
            </div>
          )}
        </Button>
      </div>
    </Box>
  );
};

export default ConfirmationModal;
