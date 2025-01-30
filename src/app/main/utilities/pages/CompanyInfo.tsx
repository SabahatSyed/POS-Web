import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import colorNames from "./color-names.json";

const CompanyInfo = () => {
  const title = "Company Information";
  const { control, handleSubmit, formState, setValue, watch } = useForm({
    defaultValues: {
      logo: null,
      name: "",
      email: "",
      address: "",
      contact: "",
      theme: {
        primary: "",
        secondary: "",
        background: "",
      },
      owner: {
        name: "",
        email: "",
        contact: "",
        cnic: "",
        photoURL: "",
        role: "Employee",
        status: "Inactive",
      },
      pagesAccess: [],
    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("You must enter a value"),
        email: yup.string().email().required("You must enter a value"),
        address: yup.string().required("You must enter a value"),
        contact: yup.string().required("You must enter a value"),
        logo: yup.object(),
        theme: yup.object().shape({
          primary: yup.string().required("Select primary color"),
          secondary: yup.string().required("Select secondary color"),
          background: yup.string().required("Select background color"),
        }),
        owner: yup.object().shape({
          name: yup.string().required("You must enter a value"),
          email: yup.string().email().required("You must enter a value"),
          contact: yup.string(),
          cnic: yup.string(),
          photoURL: yup.string(),
          role: yup.string().required("Select a role"),
          status: yup.string().required("Select a status"),
        }),
        pagesAccess: yup.array()
      })
    ),
  });

  const [loading, setLoading] = useState(false);
  const { isValid, errors } = formState;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Call your dispatch function for adding or updating company info
      // Example: await dispatch(addCompanyInfo(data));
      // if successful:
      dispatch(
        showMessage({ message: "Company Info Saved", variant: "success" })
      );
      setLoading(false);
    } catch (error) {
      dispatch(showMessage({ message: error?.message, variant: "error" }));
      setLoading(false);
    }
  };

  // Map color-names.json data into an array
  const colorOptions = Object.entries(colorNames).map(([hex, name]) => ({
    hex,
    name,
  }));

  const handleCancel = () => {
    navigate(-1);
  };

  const data = watch();

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 gap-y-40 gap-x-12 lg:w-full w-full lg:ml-10">
        {/* Company Information Section */}
        <div className="col-span-1 md:col-span-2">
          <Typography variant="h6" gutterBottom>
            Company Information
          </Typography>
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <div className="flex justify-center mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setValue("logo", e.target.files[0])}
                  {...field}
                  style={{
                    display: "none",
                  }}
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <img
                    src={
                      field.value
                        ? URL.createObjectURL(field?.value)
                        : "https://via.placeholder.com/150"
                    }
                    alt="Company Logo"
                    className="rounded-full cursor-pointer"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </label>
              </div>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  required
                  style={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  required
                  style={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  variant="outlined"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors?.address?.message}
                  required
                  style={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="contact"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contact"
                  variant="outlined"
                  fullWidth
                  error={!!errors.contact}
                  helperText={errors?.contact?.message}
                  required
                  style={{ backgroundColor: "white" }}
                />
              )}
            />
          </div>
        </div>

        {/* Theme Section */}
        <div className="col-span-1 md:col-span-2">
          <Typography variant="h6" gutterBottom>
            Theme
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="theme.primary"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  style={{ backgroundColor: "white" }}>
                  <MenuItem value="" disabled>
                    Primary Color
                  </MenuItem>
                  {colorOptions.map(({ hex, name }) => (
                    <MenuItem
                      key={hex}
                      value={hex}
                      style={{ backgroundColor: hex }}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="theme.secondary"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  style={{ backgroundColor: "white" }}>
                  <MenuItem value="" disabled>
                    Secondary Color
                  </MenuItem>
                  {colorOptions.map(({ hex, name }) => (
                    <MenuItem
                      key={hex}
                      value={hex}
                      style={{ backgroundColor: hex }}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="theme.background"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  style={{ backgroundColor: "white" }}>
                  <MenuItem value="" disabled>
                    Background Color
                  </MenuItem>
                  {colorOptions.map(({ hex, name }) => (
                    <MenuItem
                      key={hex}
                      value={hex}
                      style={{ backgroundColor: hex }}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>

        <Divider className="my-6 col-span-1 md:col-span-2" />

        {/* Owner Information Section */}
        <div className="col-span-1 md:col-span-2">
          <Typography variant="h6" gutterBottom>
            Owner Information
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="owner.name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Owner Name"
                  variant="outlined"
                  fullWidth
                  error={!!errors.owner?.name}
                  helperText={errors?.owner?.name?.message}
                  required
                  style={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="owner.email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Owner Email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.owner?.email}
                  helperText={errors?.owner?.email?.message}
                  required
                  style={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="owner.contact"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Owner Contact"
                  variant="outlined"
                  fullWidth
                  error={!!errors.owner?.contact}
                  helperText={errors?.owner?.contact?.message}
                  style={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="owner.cnic"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Owner CNIC"
                  variant="outlined"
                  fullWidth
                  error={!!errors.owner?.cnic}
                  helperText={errors?.owner?.cnic?.message}
                  style={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="owner.photoURL"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Owner Photo URL"
                  variant="outlined"
                  fullWidth
                  error={!!errors.owner?.photoURL}
                  helperText={errors?.owner?.photoURL?.message}
                  style={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="owner.role"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  style={{ backgroundColor: "white" }}>
                  <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Employee">Employee</MenuItem>
                </Select>
              )}
            />
            <Controller
              name="owner.status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  style={{ backgroundColor: "white" }}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              )}
            />
          </div>
        </div>

        <Divider className="my-6 col-span-1 md:col-span-2" />

        {/* Pages Access Section */}
        <div className="col-span-1 md:col-span-2">
          <Typography variant="h6" gutterBottom>
            Pages Access
          </Typography>
          {[
            {
              id: "setup",
              title: "Setup",
              children: [
                { id: "setup-maingroup", title: "Main Group" },
                { id: "setup-chartofaccounts", title: "Chart Of Accounts" },
                { id: "setup-inventorygroup", title: "Inventory Group" },
                { id: "setup-inventory", title: "Inventory Information" },
                { id: "setup-salesmen", title: "Salesmen" },
                { id: "setup-companynames", title: "Company Names" },
                { id: "setup-batch", title: "Batch" },
                { id: "setup-opening-balances", title: "Opening Balances" },
                { id: "setup-expiry-dates", title: "Expiry Dates" },
              ],
            },
            {
              id: "utilities",
              title: "Utilities",
              children: [
                { id: "utilities-newuser", title: "Add New User" },
                { id: "utilities-userlist", title: "All Users" },
                { id: "utilities-formname", title: "Form Names" },
                { id: "utilities-permissions", title: "Permissions" },
                {
                  id: "utilities-opening-balances",
                  title: "Carry Opening Balances",
                },
              ],
            },
            {
              id: "entry",
              title: "Entry",
              children: [
                { id: "entry-salesbill", title: "Sales Bill" },
                { id: "entry-purchasebill", title: "Purchase Bill" },
                { id: "entry-paymentreceipt", title: "Payment Receipt" },
                { id: "entry-estimatebill", title: "Estimate Bill" },
                { id: "entry-generalbill", title: "General Bill" },
              ],
            },
            {
              id: "reports",
              title: "Reports",
              children: [
                { id: "one-a/c-head-ledger", title: "One A/C Head Ledger" },
                { id: "day-book-for-date", title: "Day Book For Date" },
                { id: "one-item-ledger", title: "One Item Ledger" },
                { id: "accounts-reports", title: "Accounts Report" },
              ],
            },
          ].map((section) => (
            <div key={section.id}>
              <Typography variant="subtitle1" className="my-4 font-800 underline">{section.title}</Typography>
              {section.children.map((page) => (
                <div key={page.id} className="flex flex-col ">
                  <Typography variant="body2" className="mr-4 font-600 my-4">
                    {page.title}:
                  </Typography>
                  <div className="flex items-center"><Controller
                    name={`pagesAccess.${page.id}.read`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} />}
                        label="Read"
                      />
                    )}
                  />
                  <Controller
                    name={`pagesAccess.${page.id}.add`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} />}
                        label="Add"
                      />
                    )}
                  />
                  <Controller
                    name={`pagesAccess.${page.id}.update`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} />}
                        label="Update"
                      />
                    )}
                  />
                  <Controller
                    name={`pagesAccess.${page.id}.delete`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} />}
                        label="Delete"
                      />
                    )}
                  />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex my-48 items-center justify-end border-t mx-8 mt-32 px-8 py-5">
        <Button
          className="mx-8 text-black"
          type="button"
          onClick={handleCancel}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="secondary"
          type="submit"
          disabled={!isValid || loading}>
          <div className="flex items-center">
            Save
            {loading && (
              <div className="ml-8 mt-2">
                <CircularProgress size={16} color="inherit" />
              </div>
            )}
          </div>
        </Button>
      </div>
    </form>
  );

  const header = (
    <div className="flex w-full container">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            {title}
          </Typography>
          <Typography
            className="font-medium tracking-tight"
            color="text.secondary">
            Manage company details and settings
          </Typography>
        </div>
      </div>
    </div>
  );

  const content = (
    <div className="w-full px-24 md:px-32 pb-24">
      {useMemo(() => {
        const container = {
          show: {
            transition: {
              staggerChildren: 0.06,
            },
          },
        };

        const item = {
          hidden: { opacity: 0 },
          show: { opacity: 1 },
        };

        return (
          <motion.div
            className="flex flex-col gap-8 mt-32"
            variants={container}
            initial="hidden"
            animate="show">
            {formContent}
          </motion.div>
        );
      }, [formContent])}
    </div>
  );

  return (
    <FusePageSimple
      header={header}
      content={content}
      sidebarInner
      scroll="page"
    />
  );
};

export default CompanyInfo;
