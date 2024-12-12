import React, { FC, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Modal,
  Box,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import "@mui/material/styles";
import { styled } from "@mui/material/styles";
import "./modal.css"
import CheckBox from "@mui/icons-material/CheckBox";
import axios from "axios";
import { addDays, format } from "date-fns";
import { useNavigate } from "react-router";

interface CancelSubscriptionProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  order?: any;
  nextBillDate?:any;
}

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: "4px",
  fontWeight: "bold",
  padding: theme.spacing(1.5, 3),
  "&.cancel": {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.primary,
  },
  "&.confirm": {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
  },
}));
const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	// border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};
const CancelSubscription: FC<CancelSubscriptionProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  order,
  content,
  nextBillDate
}) => {
  const [keepModalOpen, setKeepModalOpen]= useState(false);
  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [pauseDays, setPauseDays] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate= useNavigate();
  	const handleGoBack = () => {
      navigate("/profile");
    };
  const handleChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setPauseDays(""); // Clear the field if the input is empty
    } else {
      const numberValue = Number(value);

      // Check if the value is a whole number and greater than 0
      if (Number.isInteger(numberValue) && numberValue > 0) {
        setPauseDays(numberValue);
      } else {
        // Handle invalid input, e.g., display an error message or reset the input
        console.error(
          "Please enter a valid number of days (whole number greater than 0)."
        );
      }
    }
  };

    const pauseSubscription = async() => {
      setLoading(true)
      try {
       const response = await axios.post('/api/orders/pause_subscription',{pause_days:(pauseDays),order_id:order})
        setIsPaused(true);
        handleGoBack();
      } catch (error) {
        console.log(error);
      }
      setLoading(false)
    };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Typography
          variant="body1"
          component="div"
          style={{ marginTop: "16px", marginBottom: "16px" }}
        >
          <div className="">
            <div className="">
              <h2 className="font-bold">Cancel your plan</h2>
              {content}
              <div className="modal-buttons">
                <button
                  className="go-back-button"
                  onClick={() => {
                    setKeepModalOpen(true);
                  }}
                >
                  Keep existing subscription
                </button>
                <button
                  className="pause-button"
                  onClick={() => {
                    setPauseModalOpen(true);
                  }}
                >
                  Pause Subscription
                </button>
                <button className="cancel-button" onClick={onConfirm}>
                  I am sure I want to cancel
                </button>
              </div>
            </div>
          </div>
        </Typography>
      </DialogContent>
      {/* <DialogActions style={{ justifyContent: "center", padding: "16px" }}>
        <CustomButton onClick={onClose} className="cancel">
          Go back
        </CustomButton>
        <CustomButton
          onClick={onConfirm}
          className="confirm"
          style={{ marginLeft: "16px", border: "2px solid red" }}
        >
          Cancel plan
        </CustomButton>
      </DialogActions> */}
      <Modal
        keepMounted
        open={keepModalOpen}
        onClose={() => {
          setKeepModalOpen(false);
          onClose();
        }}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        {/* edit create order form */}

        <Box sx={style} className="sm:rounded-8 border-1 px-6 py-4 sm:p-20 ">
          <div>
            Thank you for keeping your existing subscription! Keep on sourcing!
          </div>
          <div className="text-center pt-10">
            <button
              onClick={() => {
                setKeepModalOpen(false);
                onClose();
              }}
              className="bg-secondary hover:bg-secondary py-5 px-12 text-white rounded-lg "
            >
              OK
            </button>
          </div>
        </Box>
      </Modal>
      <Modal
        keepMounted
        open={pauseModalOpen}
        onClose={() => {
          setPauseModalOpen(false);
          if (isPaused) {
            onClose();
            navigate(-1);
          }
        }}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        {/* edit create order form */}

        <Box sx={style} className="sm:rounded-8 border-1 px-6 py-4 sm:p-20">
          {isPaused ? (
            <>
              <div className="text-lg font-bold">
                Once your existing subscription expires on{" "}
                {format(nextBillDate, "MMMMMMMM dd, y")} we will wait{" "}
                {pauseDays} days and renew your subscription on{" "}
                {format(addDays(nextBillDate, pauseDays), "MMMMMMMM dd, y")}!
              </div>
              <div className="text-center pt-10">
                <button
                  onClick={() => {
                    setPauseModalOpen(false);
                    onClose();
                  }}
                  className="bg-secondary hover:bg-secondary py-5 px-12 text-white rounded-lg "
                >
                  OK
                </button>
              </div>
            </>
          ) : (
            <>
              {" "}
              <div className="flex gap-5 items-start">
                <div
                  className="cursor-pointer "
                  onClick={() => setPauseModalOpen(false)}
                >
                  <KeyboardBackspaceIcon />
                </div>

                <div className="text-lg font-bold text-center">
                  How long would you like to pause your subscription?
                </div>
              </div>
              <div className="my-auto py-10 flex items-center justify-center gap-10">
                <input
                  className="rounded-lg border p-10 w-[20%] "
                  value={pauseDays}
                  onChange={handleChange}
                  onClick={(e)=>e.target.select()}
                  type="number"
                />
                <div className=" text-md font-bold">Days</div>
              </div>
              <div className="text-center">
                <Button
                  disabled={pauseDays===0 || pauseDays ==''}
                  className="pause-button py-10 text-center"
                  onClick={pauseSubscription}
                >
                  Pause subscription
                  {loading && <CircularProgress sx={{color:'white'}}  size={18} />}
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </Dialog>
  );
};

export default CancelSubscription;
