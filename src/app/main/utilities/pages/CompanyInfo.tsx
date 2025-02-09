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
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import colorNames from "./color-names.json";
import { uploadImageToCloudinary } from "app/shared-components/uploadImage";
import axios from "axios";
import {
  createCompany,
  createUser,
  updateCompany,
} from "../store/utilitiesGroupSlice";
import { useAppSelector } from "app/store";
import { selectUser } from "app/store/user/userSlice";

interface FormData {
  logoURL: string;
  name: string;
  email: string;
  address: string;
  contact: string;
  companyType: string;
  theme: {
    primary?: string;
    secondary?: string;
    background?: string;
  };
  owner: {
    name: string;
    email: string;
    cnic: string;
  };
  pagesAccess: {
    [key: string]: {
      read: boolean;
      add: boolean;
      update: boolean;
      delete: boolean;
    };
  };
}
const CompanyInfo = () => {
  const dispatch = useDispatch<any>();
  const user = useAppSelector(selectUser);
  console.log("da", user);
  const title = "Company Information";
  const { control, handleSubmit, formState, setValue, watch } = useForm({
    defaultValues: {
      logoURL: "",
      name: "",
      email: "",
      address: "",
      contact: "",
      companyType: "",
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
      pagesAccess: {},
    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("You must enter a value"),
        email: yup.string().email().required("You must enter a value"),
        address: yup.string().required("You must enter a value"),
        contact: yup.string().required("You must enter a value"),
        logoURL: yup.string(),
        companyType: yup.string().required("You must select a company type"),
        theme: yup.object().shape({
          primary: yup.string().required("Select primary color"),
          secondary: yup.string().required("Select secondary color"),
          background: yup.string().required("Select background color"),
        }),
        owner:
          user.role == "SuperAdmin"
            ? yup.object().shape({
                name: yup.string().required("You must enter a value"),
                email: yup.string().email().required("You must enter a value"),
                contact: yup.string(),
                cnic: yup.string(),
                photoURL: yup.string(),
                role: yup.string().required("Select a role"),
                status: yup.string().required("Select a status"),
              })
            : yup.object().notRequired(),
        pagesAccess:
          user.role == "SuperAdmin" ? yup.object() : yup.object().notRequired(),
      })
    ),
  });
  const [companyTypes, setCompanyTypes] = useState([]);

  useEffect(() => {
    const fetchCompanyTypes = async () => {
      try {
        const response = await axios.get("/api/companytype"); // Adjust the URL to your backend endpoint
        setCompanyTypes(response.data.data);
      } catch (error) {
        console.error("Error fetching company types:", error);
      }
    };

    fetchCompanyTypes();
  }, []);

  const [loading, setLoading] = useState(false);
  const { isValid, errors } = formState;
  console.log("is", isValid, errors);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      if (user.role == "SuperAdmin") {
        // Create company
        setLoading(true);
        const companyResponse = await dispatch(
          createCompany({ payload: data })
        ).unwrap();

        console.log("res", companyResponse);
        const companyId = companyResponse.company.id;

        // Create user with company ID and page access
        const userPayload = {
          ...data.owner,
          companyId,
          pagesAccess: data.pagesAccess,
        };
        await dispatch(createUser({ payload: userPayload })).unwrap();
        dispatch(
          showMessage({ message: "Company Info Saved", variant: "success" })
        );
        setLoading(false);
        console.log("Company and user created successfully");
      } else {
        setLoading(true);
        await dispatch(updateCompany({ payload: data, id: user.companyId }));

        dispatch(
          showMessage({ message: "Company Info Updated", variant: "success" })
        );
        setLoading(false);
        console.log("Company Info Updated successfully");
      }
    } catch (error) {
      console.error("Error creating company or user:", error);
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

  useEffect(() => {
    const fetchCompanyData = async () => {
      console.log("user", user);
      if (user?.role && user?.companyId) {
        try {
          const response = await axios.get(`/api/company/${user.companyId}`);
          const companyData = response.data.company;
          console.log("res", response, companyData);
          setValue("logoURL", companyData.logoURL);
          setValue("name", companyData.name);
          setValue("email", companyData.email);
          setValue("address", companyData.address);
          setValue("contact", companyData.contact);
          setValue("companyType", companyData.companyType);
          setValue("theme", companyData.theme);
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      }
    };

    fetchCompanyData();
  }, [user, setValue]);

  const data = watch();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "http://localhost:5000/upload-image",
          formData
        );
        const uploadedUrl = response.data.imageUrl;
        setValue("logoURL", uploadedUrl); // Set the URL in the field
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handlePermissionChange = (field, value, readField) => {
    setValue(field, value);
    if (value) {
      setValue(readField, true);
    }

    if (field === readField && !value) {
      const pageId = field.split(".")[1]; // Extract the page ID from the field name
      setValue(`pagesAccess.${pageId}.add`, false);
      setValue(`pagesAccess.${pageId}.update`, false);
      setValue(`pagesAccess.${pageId}.delete`, false);
    }
  };

  const pagesAccess = watch("pagesAccess");

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 gap-y-40 gap-x-12 lg:w-full w-full lg:ml-10">
        {/* Company Information Section */}
        <div className="col-span-1 md:col-span-2">
          <Controller
            name="logoURL"
            control={control}
            render={({ field }) => (
              <div className="mb-20">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    field.onChange(e);
                    handleFileChange(e);
                  }}
                  style={{ display: "none" }}
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <img
                    src={
                      field.value
                        ? field.value
                        : "https://via.placeholder.com/150"
                    }
                    className="rounded-full cursor-pointer border border-2 mb-5 h-80 w-80"
                    // alt="Company Logo"
                  />
                </label>
              </div>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
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
            <Controller
              name="companyType"
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
                    Select Company Type
                  </MenuItem>
                  {companyTypes.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>

        {/* Theme Section */}
        <div className="col-span-1 md:col-span-2">
          <Typography variant="h6" gutterBottom>
            Theme
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
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
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: hex,
                          marginRight: 10,
                        }}
                      ></div>
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
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: hex,
                          marginRight: 10,
                        }}
                      ></div>
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
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: hex,
                          marginRight: 10,
                        }}
                      ></div>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>
        {user.role === "SuperAdmin" && (
          <>
            <Divider className="my-6 col-span-1 md:col-span-2" />

            {/* Owner Information Section */}
            <div className="col-span-1 md:col-span-2">
              <Typography variant="h6" gutterBottom>
                Owner Information
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
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
                      <MenuItem value="" disabled>
                        Select Role
                      </MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
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
              <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-10 ">
                {[
                  {
                    id: "setup",
                    title: "Setup",
                    children: [
                      { id: "setup-maingroup", title: "Main Group" },
                      {
                        id: "setup-chartofaccounts",
                        title: "Chart Of Accounts",
                      },
                      { id: "setup-inventorygroup", title: "Inventory Group" },
                      { id: "setup-inventory", title: "Inventory Information" },
                      { id: "setup-salesmen", title: "Salesmen" },
                      { id: "setup-companynames", title: "Company Names" },
                      { id: "setup-batch", title: "Batch" },
                      {
                        id: "setup-opening-balances",
                        title: "Opening Balances",
                      },
                      { id: "setup-expiry-dates", title: "Expiry Dates" },
                    ],
                  },
                  {
                    id: "utilities",
                    title: "Utilities",
                    children: [
                      { id: "utilities-users", title: "Add New User" },
                      // { id: "utilities-userlist", title: "All Users" },
                      // { id: "utilities-formname", title: "Form Names" },
                      // { id: "utilities-permissions", title: "Permissions" },
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
                      {
                        id: "one-a/c-head-ledger",
                        title: "One A/C Head Ledger",
                      },
                      { id: "day-book-for-date", title: "Day Book For Date" },
                      { id: "one-item-ledger", title: "One Item Ledger" },
                      { id: "accounts-reports", title: "Accounts Report" },
                    ],
                  },
                ].map((section) => (
                  <div key={section.id} className="border border-b p-10">
                    <Typography
                      variant="subtitle1"
                      className="my-4 font-800 underline"
                    >
                      {section.title}
                    </Typography>
                    {section.children.map((page, index) => (
                      <div key={page.id} className="flex flex-col ">
                        <Typography
                          variant="body2"
                          className="mr-4 font-600 my-4"
                        >
                          {page.title}:
                        </Typography>

                        <div className="flex items-center">
                          <Controller
                            name={
                              `pagesAccess.${page.id}.read` as keyof FormData["pagesAccess"]
                            }
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...field}
                                    checked={
                                      pagesAccess[page.id]?.read || false
                                    }
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        field.name,
                                        e.target.checked,
                                        `pagesAccess.${page.id}.read`
                                      )
                                    }
                                  />
                                }
                                label="Read"
                              />
                            )}
                          />
                          <Controller
                            name={
                              `pagesAccess.${page.id}.add` as keyof FormData["pagesAccess"]
                            }
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...field}
                                    checked={pagesAccess[page.id]?.add || false}
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        field.name,
                                        e.target.checked,
                                        `pagesAccess.${page.id}.read`
                                      )
                                    }
                                  />
                                }
                                label="Add"
                              />
                            )}
                          />
                          <Controller
                            name={
                              `pagesAccess.${page.id}.update` as keyof FormData["pagesAccess"]
                            }
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...field}
                                    checked={
                                      pagesAccess[page.id]?.update || false
                                    }
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        field.name,
                                        e.target.checked,
                                        `pagesAccess.${page.id}.read`
                                      )
                                    }
                                  />
                                }
                                label="Update"
                              />
                            )}
                          />
                          <Controller
                            name={
                              `pagesAccess.${page.id}.delete` as keyof FormData["pagesAccess"]
                            }
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...field}
                                    checked={
                                      pagesAccess[page.id]?.delete || false
                                    }
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        field.name,
                                        e.target.checked,
                                        `pagesAccess.${page.id}.read`
                                      )
                                    }
                                  />
                                }
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
          </>
        )}
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
          disabled={!errors || loading}
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
      // sidebarInner
      scroll="page"
    />
  );
};

export default CompanyInfo;
