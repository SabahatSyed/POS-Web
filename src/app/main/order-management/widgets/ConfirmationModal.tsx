import { Modal } from '@mui/base';
import { Button, CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { SetStateAction } from 'react'

interface ConfirmationModalProps {
  title?: string;
  open?: boolean;
  loading?: boolean;
  onClose: () => void;
  setLoading: SetStateAction<any>;
  type?: "delete";
  onConfirm: () => void;
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
const ConfirmationModal:React.FC<ConfirmationModalProps> = ({title="",type="Confirm",open=false,loading=false,onClose=()=>{},onConfirm=()=>{}}) => {
  return (
    <Box sx={style} className="rounded-8 border-1 flex flex-col gap-36 justify-center items-center">
      <Typography className="font-semibold md:text-[26px] text-14">{title}</Typography>
      <div className=" justify-end w-full flex gap-20">
        <Button onClick={onClose} variant="contained">
          Cancel
        </Button>
        <Button
          sx={{
            background: type === "delete" ? "#EE6161" : "#0E505C",
            ":hover": {
              background: type === "delete" ? "#EE6161" : "#0E505C",
            },
          }}
          onClick={() => {
            onConfirm();
          }}
          variant="contained"
          color="secondary"
        >
          {type === "delete" ? "Delete" : "Confirm"}
          {loading && (
            <div className="ml-6 inline-flex items-center">
              <CircularProgress size={16} color="inherit" />
            </div>
          )}
        </Button>
      </div>
    </Box>
  );
}

export default ConfirmationModal