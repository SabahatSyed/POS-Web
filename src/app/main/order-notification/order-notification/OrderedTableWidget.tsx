import React, { useEffect, useMemo, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import _ from "@lodash";
import FusePageSimple from "@fuse/core/FusePageSimple";
import {
  getRecords as getRolesRecords,
  getUsers,
} from "../../favourites/store/prepCenterSlice";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "app/store";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import AddIcon from "@mui/icons-material/Add";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import format from "date-fns/format";

import dayjs, { Dayjs } from "dayjs";
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";

import {
  TableConfig,
  TableEvent,
} from "app/shared-components/data-table-widget/types/dataTypes";
import axios from "axios";
import { showMessage } from "app/store/fuse/messageSlice";
import ConfirmationModal from "../widgets/ConfirmationModal";
import { selectUser, selectUserRole } from "app/store/user/userSlice";

/**
 * The TablePageWidget.
 */
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

type TablePageWidgetProps = {
  title: string;
  tableConfig: TableConfig;
  getRecords: any;
  deleteRecord?: any;
  showLoader?: boolean;
  isSheets?: boolean;
  queryParams?: any;
  selectedRow?: any;
  // showForm?: any;
  // setShowForm?: any;
  setSelectedRow?: any;
  clickedRow?: any;
};
interface DateValueProps {
  fromDate?: Dayjs | null;
  toDate?: Dayjs | null;
}
function OrderedTableWidget(props: TablePageWidgetProps) {
  const {
    title,
    tableConfig,
    isSheets = false,
    queryParams,
    // showForm,
    // setShowForm,
    clickedRow,
  } = props;
  const userRole = useAppSelector(selectUserRole);
  console.log(userRole);

  const data = props.tableConfig.dataSource;
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [buttonLoading, setIsButtonLoading] = useState("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>([]);
  const [dateValues, setDateValues] = React.useState<any>({
    fromDate: null,
    toDate: null,
  });
  const [filterValues, setFilterValues] = useState<any>({
    prep_center_ids: null,
    status: ['Placed'],
    order_types: null,
    user_ids: null,
  });
  const [formValues, setFormValues] = useState({
    note: null,
    page_link: null,
  });

  const getRecords = props.getRecords;

  // console.log(onSomeEvent);
  const [reason, setReason] = React.useState('Wrong Prep Center');
  const [otherReason, setOtherReason] = React.useState('');



  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const dispatch = useAppDispatch();
  useEffect(()=>{
    if(Object.keys(data).length===0)
    dispatch(getRecords({ page:  1,limit: 10,id: null}))
  },[data])


  function handleRefresh() {
    setLoading(true);
    setIsButtonLoading("refresh");
    dispatch(getRecords(pagination)).finally(() => {
      setIsButtonLoading("refresh");
      setLoading(false);
    });
  }
  const handleReject= async () => {
    // setIsButtonLoading("confirm");
      setDeleteLoading(true)
    
     // Iterate over each favorite ID in the selectedRow array
      console.log("res",selectedRow)
         try {
           await axios.put(`/api/order_list/reject_order`,{
            status: 'Placed',
            id: selectedRow.id,
            rejected_reason: reason != "Others" ? reason : otherReason
           })
           props.setSelectedRow({});
           setDeleteDialogOpen(false)
           setOtherReason('')
         } catch (error) {
           // Log the error for each failed API call
           setLoading(false);
      // setIsButtonLoading("");
           console.error(`Error Updating Orders with ID :`, error);
         }
       
     
     dispatch(showMessage({ variant: "success", message: "Success" }));
     // Clear all selected rows after successful removal
      setSelectedRow({});
      setDeleteLoading(false);
      // setIsButtonLoading("");
      handleRefresh();
   };
  const handleConfirmOrder = async () => {
    // setIsButtonLoading("confirm");
    setLoading(true)
    
     // Iterate over each favorite ID in the selectedRow array
         try {
           await axios.put(`/api/order_list/accept_order`,{
            status: 'Placed',
            id: selectedRow.id,
           })
           props.setSelectedRow({});
           setDeleteDialogOpen(false)
           setOtherReason('')
           handleCloseDialog();
         } catch (error) {
           // Log the error for each failed API call
           setLoading(false);
      // setIsButtonLoading("");
           console.error(`Error Updating Orders with ID :`, error);
         }
       
     
     dispatch(showMessage({ variant: "success", message: "Success" }));
     // Clear all selected rows after successful removal
      setSelectedRow({});
      setLoading(false);
      // setIsButtonLoading("");
      handleRefresh();
  };
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      if (data.records.length === 0 && Number(data.page) > 1) {
        dispatch(getRecords({ page: data.page - 1}));
      }
    }
  }, [data]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  
  const header = (
    <div className="flex flex-col w-full container bg-white rounded-t-28">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto mb-10">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            {title}
          </Typography>
          <Typography
            className="font-medium tracking-tight"
            color="text.secondary"
          >
            Keep track of your data
          </Typography>
        </div>
      </div>
    </div>
  );
  useEffect(() => {
    if (selectedRow) {
      setFormValues({
        note: selectedRow.note,
        page_link: selectedRow.page_link,
      });
    }
  }, [selectedRow, clickedRow]);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const note = e.target.value;
    if (note.length <= 99) {
      setFormValues((prevState) => ({ ...prevState, note }));
      setCharCount(note.length);
    }
  };

  const content = (
    <>
      <div className="w-full px-24 md:px-32 pb-24 bg-white rounded-b-28 ">
        {useMemo(() => {
          const container = {
            show: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          };

          const item = {
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          };

          return (
            !_.isEmpty(data) && (
              <motion.div
                className={`w-full `}
                variants={container}
                initial="hidden"
                animate="show"
              >
                <div className={`grid grid-cols-1 gap-32 w-full mt-32`}>
                  <motion.div
                    variants={item}
                    className="xl:col-span-2 flex flex-col flex-auto border rounded-20"
                    style={{
                      minHeight: "min-content",
                      maxHeight: "70vh",
                      overflowY: "auto",
                    }} // Adjust maxHeight as needed
                  >
                    <Table className="  ">
                      <TableBody>
                        {data?.records?.map((item, index) => (
                          <TableRow key={index} onClick={()=>setSelectedRow(item)} >
                            <TableCell
                              // key={column.name}
                              component="th"
                              scope="row"
                            >
                              {item?.image ? (
                                <Avatar
                                  className=""
                                  alt="user photo"
                                  src={item.image}
                                  sx={{
                                    height: 100,
                                    width: 100,
                                    borderRadius: "100%",
                                  }}
                                />
                              ) : (
                                <Typography>No Image Available</Typography>
                              )}
                            </TableCell>
                            <TableCell
                              // key={column.name}
                              component="th"
                              scope="row"
                            >
                              <Typography className=" line-clamp-2 font-semibold text-lg">
                                <span className=" text-gray">
                                  # {item.order_no}
                                </span>{" "}
                                is placed by{" "}
                                <span className=" text-secondary">
                                  {item.user}
                                </span>{" "}
                                on{" "}
                                <span className=" text-gray">
                                  {typeof item.order_date == "number"
                                    ? format(
                                        new Date(item.order_date * 1000),
                                        "MMM dd, y"
                                      )
                                    : format(
                                        new Date(item.order_date),
                                        "MMM dd, y"
                                      )}
                                </span>{" "}
                                , Quantity <span>{item.quantity_ordered}</span>{" "}
                                pieces.
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={()=>setDeleteDialogOpen(true)}
                                className="whitespace-nowrap"
                                // variant="contained"
                                color="secondary"
                        
                              >
                                Reject
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                               onClick={()=>setDialogOpen(true)}
                                className="whitespace-nowrap"
                                variant="contained"
                                color="secondary"
                        
                              >
                                Accept
                               
                                  
                              </Button>
                            </TableCell>
                          
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    

                  </motion.div>
                </div>
              </motion.div>
            )
          );
        }, [data, props.selectedRow, formValues, loading])}
      </div>

      <Modal
        keepMounted
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <ConfirmationModal
          loading={loading}
          setLoading={setLoading}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmOrder}
          title="Do you want to Accept this order?"
        />
      </Modal>
      <Modal
        keepMounted
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <ConfirmationModal
          loading={deleteLoading}
          setLoading={setDeleteLoading}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleReject}
          setReason={setReason}
          setOtherReason={setOtherReason}
          reason={reason}
          otherReason={otherReason}
          type="delete"
          title="Why you're rejecting this order?"
        />
      </Modal>
    </>
  );

  return (
    <div className="m-16 mx-20">
      <FusePageSimple header={header} content={content} />
    </div>
  );
}

export default OrderedTableWidget;
