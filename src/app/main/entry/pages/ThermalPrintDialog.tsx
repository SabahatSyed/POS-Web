import React, { useRef } from "react";
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
import { useAppDispatch, useAppSelector } from "app/store";
import { selectUser } from "app/store/user/userSlice";

const ThermalPrintDialog = ({
  openThermal,
  handleCloseThermal,
  handleOpenThermal,
  handleOpen,
  discount,
  discountAmount,
  netAmount,
  totalAmount,
  balance,
  products,
  invoice,
  customer,
  salesman,
  date,
  remarks,
}) => {
  const printContentRef = useRef();
  const user = useAppSelector(selectUser);
  // Ref to capture the printable content

  // Print functionality
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
    <Dialog
      fullScreen
      open={openThermal}
      onClose={handleCloseThermal}
      sx={{
        "& .MuiDialog-paper": {
          width: "400px", // Narrower width for thermal print style
          maxWidth: "100%",
          margin: "auto",
          // padding: "20px",
          backgroundColor: "#fff", // White background for simplicity
          boxShadow: "none", // No shadow to keep the print feel
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontFamily: "'Courier New', monospace", // Monospaced font
          fontSize: "16px", // Slightly smaller font size for thermal look
          fontWeight: "bold",
          borderBottom: "1px solid black", // Light border for separation
          paddingBottom: "10px",
          display: "flex",
          justifyContent: "center", // Center the title text
          alignItems: "center", // Align the logo and text vertically
        }}
      >
        {/* Company Logo */}
        <Box sx={{ position: "absolute", left: 10 }}>
          <img
            src={user.logoURL}
            alt="Company Logo"
            style={{ height: "40px" }}
          />
        </Box>
        Estimate Invoice
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

      <DialogContent>
        {/* Header Section */}
        <Box ref={printContentRef}>
          <Box sx={{ marginBottom: 10, marginTop:10 }}>
            <img
              src={user.logoURL}
              alt="Company Logo"
              style={{ height: "80px", margin: "auto" }}
            />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr", // Two columns for better spacing
              gap: "5px", // Minimal gap between items
              fontFamily: "'Courier New', monospace",
              fontSize: "14px", // Adjust font size for better readability
              marginBottom: "10px",
            }}
          >
            <Box>
              {/* <Typography
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Phone :
          </Typography> */}
              {/* <Typography
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            ADDRESS:
          </Typography> */}
              {/* <Typography
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            DATE:
          </Typography> */}
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Invoice: {invoice}
              </Typography>

              <Typography
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Bill To : {customer}
              </Typography>
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                remarks: {remarks}
              </Typography>
              {/* <Typography sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
      REMARKS: 
    </Typography> */}
            </Box>

            {/* <Box sx={{ textAlign: "right" }}> */}
            {/* <Typography sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
      DATE: 
    </Typography> */}
            <Typography
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              INVOICE
            </Typography>
            {/* </Box> */}
          </Box>

          {/* Table Section */}
          <Table
            sx={{
              width: "100%",
              marginBottom: "10px",
              fontFamily: "'Courier New', monospace",
              fontSize: "12px", // Adjust font size for smaller items
              tableLayout: "fixed", // Ensure table layout is fixed so columns adapt
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid black",
                    borderTop: "1px solid black",
                    textAlign: "center",
                    padding: "5px",
                  }}
                >
                  Item
                </TableCell>
                {/* <TableCell style={{ borderBottom: "1px solid black", textAlign: "center", padding: "5px" }}>Description</TableCell> */}
                <TableCell
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid black",
                    borderTop: "1px solid black",
                    textAlign: "center",
                    padding: "5px",
                  }}
                >
                  Qty
                </TableCell>
                {/* <TableCell style={{ borderBottom: "1px solid black", textAlign: "center", padding: "5px" }}>Rate</TableCell> */}
                {/* <TableCell style={{ borderBottom: "1px solid black", textAlign: "center", padding: "5px" }}>Discount</TableCell> */}
                {/* <TableCell style={{ borderBottom: "1px solid black", textAlign: "center", padding: "5px" }}>Net Rate</TableCell> */}
                <TableCell
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid black",
                    borderTop: "1px solid black",
                    textAlign: "center",
                    padding: "5px",
                  }}
                >
                  Amt
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Subtotal Row */}
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell style={{ border: "1px solid black" }}>
                    {product.description}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {product.revisedQuantity}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {product.amount}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell style={{ padding: "8px" }}>SUBTOTAL</TableCell>
                <TableCell
                  style={{ padding: "8px", textAlign: "center" }}
                ></TableCell>
                <TableCell style={{ padding: "8px", textAlign: "center" }}>
                  {totalAmount}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ padding: "8px" }}>Discount</TableCell>
                <TableCell style={{ padding: "8px", textAlign: "center" }}>
                  {discount}
                </TableCell>
                <TableCell style={{ padding: "8px", textAlign: "center" }}>
                  {discountAmount}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ padding: "8px" }}>Balance</TableCell>
                <TableCell
                  style={{ padding: "8px", textAlign: "center" }}
                ></TableCell>
                <TableCell style={{ padding: "8px", textAlign: "center" }}>
                  {balance}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    padding: "8px",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  TOTAL
                </TableCell>
                <TableCell
                  style={{
                    padding: "8px",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                    textAlign: "center",
                  }}
                ></TableCell>
                <TableCell
                  style={{
                    padding: "8px",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {netAmount.toFixed(2)}
                </TableCell>
              </TableRow>

              {/* <TableRow>
            <TableCell style={{ padding: "8px" }}>SUBTOTAL</TableCell>
            <TableCell
              style={{ padding: "8px", textAlign: "center" }}
            ></TableCell>
            <TableCell
              style={{ padding: "8px", textAlign: "center" }}
            ></TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              style={{ padding: "8px", border: "none" }}
            ></TableCell>
            <TableCell
              style={{
                padding: "8px",
                border: "none",
                textAlign: "center",
              }}
            >
              (-) Discount
            </TableCell>
            <TableCell
              style={{
                padding: "8px",
                border: "none",
                textAlign: "center",
              }}
            ></TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{ padding: "8px", border: "none" }}
            ></TableCell>
            <TableCell
              style={{
                padding: "8px",
                border: "none",
                textAlign: "center",
              }}
            >
              (-) GST 14.00%
            </TableCell>
            <TableCell
              style={{
                padding: "8px",
                border: "none",
                textAlign: "center",
              }}
            ></TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{
                padding: "8px",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
              }}
            >
              TOTAL
            </TableCell>
            <TableCell
              style={{
                padding: "8px",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                textAlign: "center",
              }}
            ></TableCell>
            <TableCell
              style={{
                padding: "8px",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                textAlign: "center",
              }}
            ></TableCell>
          </TableRow> */}
            </TableBody>
          </Table>
        </Box>
        {/* Footer Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
            fontFamily: "'Courier New', monospace",
            fontSize: "12px",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
            In case of any query, please contact at: www.example.com
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            marginTop: "30px",
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
            color="secondary"
            onClick={handleOpen}
            sx={{
              fontFamily: "'Courier New', monospace",
              padding: "5px 15px",
            }}
          >
            A4 Print
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ThermalPrintDialog;
