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

const A4Print = ({
  discount,
  open,
  handleClose,
  handleOpenThermal,
  handleCloseThermal,
}) => {
  const printContentRef = useRef();

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
    <Dialog discount={discount} fullScreen open={open} onClose={handleClose}>
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
          <img src="logo.webp" alt="Company Logo" style={{ height: "40px" }} />
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

      <DialogContent ref={printContentRef}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column", // Stack children vertically
            alignItems: "center", // Center horizontally
            justifyContent: "center", // Center vertically
            minHeight: "100vh", // Full height for centering
          }}
        >
          <Box
            sx={{
              mb: 4,
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)", // 6 equal-width columns
              // Add space between columns
            }}
          >
            {/* First and Second Columns (Shared Content) */}
            <Box sx={{ gridColumn: "1 / 3" }}>
              <Typography sx={{ marginY: 1 }}>
                BILL TO: ________________________________________
              </Typography>
              <Typography sx={{ marginY: 1 }}>
                ADDRESS: ________________________________________
              </Typography>
              <Typography sx={{ marginY: 1 }}>
                CONTACT: ________________________________________
              </Typography>
              <Typography sx={{ marginY: 1 }}>
                REMARKS: ________________________________________
              </Typography>
            </Box>

            {/* Third Column (Empty) */}
            <Box sx={{ gridColumn: "3 / 4" }}></Box>

            {/* Fourth Column */}
            <Box sx={{ gridColumn: "4 / 6" }}>
              <Typography sx={{ marginY: 1 }}>
                DATE: ____________________
              </Typography>
              <Typography sx={{ marginY: 1 }}>
                INVOICE: ____________________
              </Typography>
            </Box>

            {/* Fifth and Sixth Columns (Empty) */}
            {/* <Box sx={{ gridColumn: "5 / 6" }}></Box> */}
            <Box sx={{ gridColumn: "6 / 7" }}></Box>
          </Box>

          {/* Table Section */}
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
              {/* Subtotal Row */}
              <TableRow>
                <TableCell colSpan={2} style={{ border: "none" }}></TableCell>{" "}
                {/* Empty space */}
                <TableCell style={{ border: "1px solid black" }}>
                  <Typography>SUBTOTAL:</Typography>
                </TableCell>
                {/* <TableCell style={{ border: "1px solid black" }}></TableCell>{" "} */}
                {/* Empty */}
                <TableCell
                  style={{ border: "1px solid black" }}
                ></TableCell>{" "}
                {/* Spacer cell */}
                <TableCell style={{ border: "1px solid black" }}></TableCell>
                <TableCell
                  style={{ border: "1px solid black" }}
                ></TableCell>{" "}
                {/* Empty */}
              </TableRow>

              <TableRow>
                <TableCell
                  style={{ borderBottom: "none", height: "40px" }}
                ></TableCell>
                <TableCell
                  style={{ borderBottom: "none", height: "40px" }}
                ></TableCell>
                {/* <TableCell
                style={{ border: "1px solid black", height: "40px" }}
              ></TableCell> */}
                <TableCell
                  style={{ border: "1px solid black", height: "40px" }}
                ></TableCell>
                <TableCell
                  style={{ border: "1px solid black", height: "40px" }}
                ></TableCell>
                <TableCell
                  style={{ border: "1px solid black", height: "40px" }}
                ></TableCell>
                <TableCell
                  style={{ border: "1px solid black", height: "40px" }}
                ></TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={2} style={{ border: "none" }}></TableCell>{" "}
                {/* Empty space */}
                <TableCell style={{ border: "1px solid black" }}>
                  <Typography>TOTAL:</Typography>
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}></TableCell>{" "}
                {/* Empty */}
                {/* <TableCell
                style={{ border: "1px solid black" }}
              ></TableCell>{" "} */}
                {/* Spacer cell */}
                <TableCell style={{ border: "1px solid black" }}></TableCell>
                <TableCell
                  style={{ border: "1px solid black" }}
                ></TableCell>{" "}
                {/* Empty */}
              </TableRow>
            </TableBody>
          </Table>

          {/* Footer Section */}
          {/* <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                marginTop: 4,
                width: "70%",
              }}
            >
              <Typography>Created By: ____________________</Typography>
              <Typography>Checked By: ____________________</Typography>
              <Typography>Approved By: ____________________</Typography>
            </Box> */}
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
            {/* <Button
              variant="contained"
              className="rounded-md"
              color="secondary"
            >
              A4 Print
            </Button> */}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default A4Print;
