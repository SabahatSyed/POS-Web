import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "app/store";
import { selectUser } from "app/store/user/userSlice";
const A4Print = ({
  discount,
  discountAmount,
  netAmount,
  totalAmount,
  balance,
  products,
  open,
  handleClose,
  handleOpenThermal,
  handleCloseThermal,
  invoice,
  customer,
  salesman,
  date,
  remarks,
}) => {
  const printContentRef = useRef();
  const user = useAppSelector(selectUser);
  console.log("user", user,discount,
    discountAmount,
    netAmount,
    totalAmount,
    balance,
    products,
    open,
    handleClose,
    handleOpenThermal,
    handleCloseThermal,
    invoice,
    customer,
    salesman,
    date,
    remarks);
  const handlePrint = () => {
    const printContents = printContentRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              margin: 0;
              padding: 20px;
              background: white;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 5px;
              text-align: center;
            }
            .no-print {
              display: none;
            }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          textAlign: "center",
          fontFamily: "'Courier New', monospace",
          fontSize: "16px",
          fontWeight: "bold",
          borderBottom: "1px solid black",
          paddingBottom: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ position: "absolute", left: 10 }}>
          <img
            src={user.logoURL}
            alt="Company Logo"
            style={{ height: "40px" }}
          />
        </Box>
        Invoice
        <IconButton
          aria-label="close"
          onClick={handleCloseThermal}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "black",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent ref={printContentRef}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              mb: 4,
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
            }}
          >
            <Box sx={{ gridColumn: "1 / 3" }}>
              <Typography sx={{ marginY: 1 }}>
                BILL TO:  {customer}
              </Typography>
              {/* <Typography sx={{ marginY: 1 }}>
                ADDRESS: ________________________________________
              </Typography> */}
              {/* <Typography sx={{ marginY: 1 }}>
                CONTACT: ________________________________________
              </Typography> */}
              <Typography sx={{ marginY: 1 }}>
                REMARKS: {remarks}
              </Typography>
            </Box>

            <Box sx={{ gridColumn: "3 / 4" }}></Box>

            <Box sx={{ gridColumn: "4 / 6" }}>
              <Typography sx={{ marginY: 1 }}>
                {/* DATE: {new Date(date)} */}
              </Typography>
              <Typography sx={{ marginY: 1 }}>
                INVOICE: {invoice}
              </Typography>
            </Box>

            <Box sx={{ gridColumn: "6 / 7" }}></Box>
          </Box>

          <Table sx={{ mb: 4, width: "70%" }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>Sr.</TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  Description
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>Qty</TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  Rate
                </TableCell>
                {discount && (
                  <TableCell style={{ border: "1px solid black" }}>
                    Discount
                  </TableCell>
                )}
                <TableCell style={{ border: "1px solid black" }}>
                  Net Rate
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  Total Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell style={{ border: "1px solid black" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {product.description}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {product.quantity}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {product.tradeRate}
                  </TableCell>
                  {discount && (
                    <TableCell style={{ border: "1px solid black" }}>
                      {product.discount}
                    </TableCell>
                  )}
                  <TableCell style={{ border: "1px solid black" }}>
                    {product.netRate}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {product.amount}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} style={{ border: "none" }}></TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  <Typography>SUBTOTAL:</Typography>
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
              
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
              
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  {totalAmount}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} style={{ border: "none" }}></TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  <Typography>Balance:</Typography>
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
              
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
              
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  {balance}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} style={{ border: "none" }}></TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  <Typography>Discount:</Typography>
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
              
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
              
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  {discount}
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  {discountAmount}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} style={{ border: "none" }}></TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  <Typography>TOTAL:</Typography>
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  {netAmount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box
            sx={{
              marginY: 6,
              display: "flex",
              justifyContent: "center",
              width: "70%",
            }}
          >
            <Typography>
              In case of any query, please contact at: ______________________
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 6,
              width: "90%",
            }}
          >
            <Button
              variant="contained"
              className="rounded-md"
              onClick={handlePrint}
              color="primary"
              sx={{
                fontFamily: "'Courier New', monospace",
                padding: "5px 15px",
              }}
            >
              Print
            </Button>
            <Button
              variant="contained"
              className="rounded-md"
              onClick={handleOpenThermal}
              color="primary"
              sx={{
                fontFamily: "'Courier New', monospace",
                padding: "5px 15px",
              }}
            >
              Thermal Print
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default A4Print;
