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
import { addRecord } from "../../general-management/store/companyTypeDataSlice";
import { addRecord as companyInfoAddRecord } from "../../general-management/store/companyInfoDataSlice";
import { addRecord as pageAddRecord } from "../../general-management/store/pageDataSlice";
import { addRecord as userAddRecord } from "../../general-management/store/userDataSlice";
import { C } from "@fullcalendar/core/internal-common";

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
        primary: "blue",
        secondary: "gray",
        background: "white",
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

      if (data?.pagesAccess?.length < 0) {
        return dispatch(
          showMessage({ message: "select the access page", variant: "error" })
        );
      }

      // Helper function to dispatch actions and handle responses
      const dispatchAction = async (action, payload) => {
        const response = await dispatch(action({ payload }));
        return response;
      };

      // Step 1: Add company type
      const companyTypePayload = { name: data.name };
      const companyTypeData = await dispatchAction(
        addRecord,
        companyTypePayload
      );

      // Step 2: Add pages
      const pagePayload = {
        pages: data.pagesAccess,
        companyType: companyTypeData.payload.companyType.id,
      };
      const pageData = await dispatchAction(pageAddRecord, pagePayload);

      // Step 3: Prepare and add company information
      const pageIds = pageData.payload.data.map((page) => page._id);
      const companyInfoPayload = {
        companyType: companyTypeData.payload.companyType.id,
        pagesAccess: pageIds,
        logoURL: data.logo,
        name: data.name,
        email: data.email,
        address: data.address,
        contact: data.contact,
        theme: data.theme.secondary,
      };
      const companyData = await dispatchAction(
        companyInfoAddRecord,
        companyInfoPayload
      );

      const userPayload = {
        name: data.owner.name,
        email: data.owner.email,
        contact: data.owner.contact,
        cnic: data.owner.cnic,
        photoURL: data.owner.photo,
        role: data.owner.role,
        status: data.owner.status,
        companyId: companyData.payload.company.id,
        pagesAccess: pageIds,
        theme: data.theme.secondary,
      };
      await await dispatchAction(userAddRecord, userPayload);

      // Success Message
      dispatch(
        showMessage({ message: "Company Info Saved", variant: "success" })
      );
    } catch (error) {
      // Error Handling
      dispatch(
        showMessage({
          message: error?.message || "An unexpected error occurred",
          variant: "error",
        })
      );
    } finally {
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
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setValue("logo", e.target.files[0])}
                {...field}
              />
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="seqNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Seq Number"
                  variant="outlined"
                  fullWidth
                  error={!!errors.seqNumber}
                  helperText={errors?.seqNumber?.message}
                  required
                  style={{ backgroundColor: "white" }}
                />
              )}
            />
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
                  style={{ backgroundColor: "white" }}
                >
                  <MenuItem value="" disabled>
                    Primary Color
                  </MenuItem>
                  {colorOptions.map(({ hex, name }) => (
                    <MenuItem
                      key={hex}
                      value={hex}
                      style={{ backgroundColor: hex }}
                    >
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
                  style={{ backgroundColor: "white" }}
                >
                  <MenuItem value="" disabled>
                    Secondary Color
                  </MenuItem>
                  {colorOptions.map(({ hex, name }) => (
                    <MenuItem
                      key={hex}
                      value={hex}
                      style={{ backgroundColor: hex }}
                    >
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
                  style={{ backgroundColor: "white" }}
                >
                  <MenuItem value="" disabled>
                    Background Color
                  </MenuItem>
                  {colorOptions.map(({ hex, name }) => (
                    <MenuItem
                      key={hex}
                      value={hex}
                      style={{ backgroundColor: hex }}
                    >
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setValue("owner.photoURL", e.target.files[0])
                  }
                  {...field}
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
                  style={{ backgroundColor: "white" }}
                >
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
                  style={{ backgroundColor: "white" }}
                >
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
              <Typography variant="subtitle1">{section.title}</Typography>
              {section.children.map((page) => (
                <FormControlLabel
                  key={page.id}
                  control={
                    <Controller
                      name="pagesAccess"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          value={page.id}
                          checked={field.value.includes(page.id)}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, page.id]
                              : field.value.filter((id) => id !== page.id);
                            field.onChange(newValue);
                          }}
                        />
                      )}
                    />
                  }
                  label={page.title}
                />
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
          onClick={handleCancel}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="secondary"
          type="submit"
          disabled={!isValid || loading}
        >
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
            color="text.secondary"
          >
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
            animate="show"
          >
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
