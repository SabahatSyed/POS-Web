// ConfirmationDialog.tsx

import React, { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';
import '@mui/material/styles';


interface FormDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
    setContent: (content: string) => void;
    loading: boolean;
    heading: string;
    setHeading: (heading: string) => void;
    // messageId:string;
    user: string;
}


const FormDialog: FC<FormDialogProps> = ({ open, onClose, onConfirm, title, content, setContent, loading, heading , setHeading,user }) => {
  return (
    <>
    <Dialog open={open} onClose={onClose}>
      <div className="w-[600px] h-[330px]">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {user ==="Customer" && 
         <TextField
          required
          label="Title"
          type= "text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        /> 
        }
     
      <TextField
          required
          label="Message"
          type= "text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <div className="space-x-12 my-16 mr-16">
        <Button onClick={onClose} variant="contained">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained"  disabled= {!content || (user === 'Customer' ? !heading : undefined)} color="secondary">
          Send
          {loading && (
									<div className="ml-8 mt-2">
										<CircularProgress size={16} color="inherit"/>
									</div>
					)}
        </Button>
        </div>
      </DialogActions>
      </div>
    </Dialog>
    </>
  );
};

export default FormDialog;
