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

import { useAppSelector } from "app/store";
import { selectUser } from "app/store/user/userSlice";
import ColorPicker from "@rc-component/color-picker";
import { ChromePicker } from "react-color";

import { Autocomplete, ClickAwayListener, FormHelperText } from "@mui/material";
import "@rc-component/color-picker/assets/index.css";

import { IconButton, Popover } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { updateCompany } from "../../utilities/store/utilitiesGroupSlice";
import { updateRecord } from "../../general-management/store/userDataSlice";
const permissions = ["Read", "Add", "Update", "Delete"];

interface FormData {
  logoURL: string;
  name: string;
  email: string;
  address: string;
  contact: string;
  companyType: string;
  theme: {
    primary: string;
    secondary: string;
    background: string;
  };
  owner: {
    name: string;
    email: string;
    cnic: string;
    contact: string;
    role: string;
    status: string;
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

const ProfilePage = () => {
  const dispatch = useDispatch<any>();
  const user = useAppSelector(selectUser);
  const title = "Company Information";
  const [anchorEl, setAnchorEl] = useState<{
    [key: string]: HTMLElement | null;
  }>({
    primary: null,
    secondary: null,
    background: null,
  });
  const [selectedColor, setSelectedColor] = useState<{ [key: string]: string }>(
    {
      primary: "",
      secondary: "",
      background: "",
    }
  );
  const [inputErrors, setInputErrors] = useState<{
    [key: string]: string | null;
  }>({
    primary: null,
    secondary: null,
    background: null,
  });

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
        role: "Admin",
        status: "Active",
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
          user.role === "SuperAdmin"
            ? yup.object().shape({
                name: yup.string().required("You must enter a value"),
                email: yup.string().email().required("You must enter a value"),
                contact: yup.string(),
                cnic: yup.string(),
                role: yup.string().required("Select a role"),
                status: yup.string().required("Select a status"),
              })
            : yup.object().notRequired(),
        pagesAccess:
          user.role === "SuperAdmin"
            ? yup.object()
            : yup.object().notRequired(),
      })
    ),
  });

  const [companyTypes, setCompanyTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isValid, errors } = formState;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyTypes = async () => {
      try {
        const response = await axios.get("/api/companytype");
        setCompanyTypes(response.data.data);
      } catch (error) {
        console.error("Error fetching company types:", error);
      }
    };

    fetchCompanyTypes();
  }, []);

  const onSubmit = async (data: FormData) => {
    // console.log(data);
    try {
      
        setLoading(true);
        await dispatch(updateCompany({ payload: data, id: user.companyId }));
        await dispatch(updateRecord({ id: user?.id, payload: {name:data.owner.name, cnic:data.owner.cnic, contact:data.owner.contact} })).then(
            (resp: any) => {
              console.log(resp);
              if (resp.error) {
                dispatch(
                  showMessage({ message: resp.error.message, variant: "error" })
                );
              } else {
                dispatch(showMessage({ message: "Success", variant: "success" }));
              }
            }
          );

        dispatch(
          showMessage({ message: "Company Info Updated", variant: "success" })
        );
        setLoading(false);
        console.log("Company Info Updated successfully");
      
    } catch (error) {
      console.log("Error creating company or user:", error);
      dispatch(showMessage({ message: error?.message, variant: "error" }));
      setLoading(false);
    }
  };

  const validateHexColor = (value: string, fieldName: string) => {
    if (!value.startsWith("#")) {
      setInputErrors((prev) => ({
        ...prev,
        [fieldName]: "Color code must start with #",
      }));
      return false;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setInputErrors((prev) => ({
        ...prev,
        [fieldName]: "Invalid hex color code",
      }));
      return false;
    }
    setInputErrors((prev) => ({ ...prev, [fieldName]: null }));
    return true;
  };

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (user?.role && user?.companyId) {
        try {
          const response = await axios.get(`/api/company/${user.companyId}`);
          const companyData = response.data.company;
          setValue("logoURL", companyData.logoURL);
          setValue("name", companyData.name);
          setValue("email", companyData.email);
          setValue("address", companyData.address);
          setValue("contact", companyData.contact);
          setValue("companyType", companyData.companyType);
          setValue("theme", companyData.theme);
          setValue("pagesAccess", companyData.pagesAccess);
          console.log("sdfs",user)
            // if (user.role === "SuperAdmin") {
                setValue("owner.name", user.name);
                setValue("owner.email", user.email);
                setValue("owner.contact", user.contact);
                setValue("owner.cnic", user.cnic);
                setValue("owner.role", user.role);
                setValue("owner.status", user.status);
            // }

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
          `${process.env.REACT_APP_BASE_URL}/upload-image`,
          formData
        );
        const uploadedUrl = response.data.imageUrl;
        setValue("logoURL", uploadedUrl); // Set the URL in the field
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const pagesAccess = watch("pagesAccess");


  const handlePermissionChange = (pageId, selectedPermissions) => {
    setValue(
      `pagesAccess.${pageId}.read`,
      selectedPermissions.includes("Read")
    );
    setValue(`pagesAccess.${pageId}.add`, selectedPermissions.includes("Add"));
    setValue(
      `pagesAccess.${pageId}.update`,
      selectedPermissions.includes("Update")
    );
    setValue(
      `pagesAccess.${pageId}.delete`,
      selectedPermissions.includes("Delete")
    );
  };

  const getSelectedPermissions = (pageId) => {
    const page = pagesAccess[pageId] || {};
    return permissions.filter((perm) => page[perm.toLowerCase()]);
  };

  const handleColorPickerOpen =
    (field: string) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl({ ...anchorEl, [field]: event.currentTarget });
    };

  const handleColorPickerClose = (field: string) => {
    setAnchorEl({ ...anchorEl, [field]: null });
  };

  const handleColorChange = (field: string) => (color: string) => {
    setSelectedColor({ ...selectedColor, [field]: color });
    setValue(`theme.${field}` as any, color);
    validateHexColor(color, field);
  };

  const handleColorSelect = (field: string) => () => {
    setValue(`theme.${field}` as any, selectedColor[field]);
    validateHexColor(selectedColor[field], field);
    handleColorPickerClose(field);
  };

  const [showPicker, setShowPicker] = useState<{ [key: string]: boolean }>({
    primary: false,
    secondary: false,
    background: false,
  });

  const handlePickerOpen = (field: string) => {
    setShowPicker((prev) => ({ ...prev, [field]: true }));
  };

  const handlePickerClose = (field: string) => {
    setShowPicker((prev) => ({ ...prev, [field]: false }));
  };
  // Modified Color Picker Field Component
  const ColorField = ({
    field,
  }: {
    field: "primary" | "secondary" | "background";
  }) => {
    return (
      <Controller
        name={`theme.${field}`}
        control={control}
        render={({ field: { value, onChange } }) => (
          <div style={{ position: "relative" }}>
            <TextField
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                validateHexColor(e.target.value, field);
              }}
              error={!!inputErrors[field]}
              fullWidth
              variant="outlined"
              placeholder="#FFFFFF"
              inputProps={{ maxLength: 7 }}
              InputProps={{
                startAdornment: (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: value,
                      borderRadius: "100%",
                      marginRight: 8,
                      border: "1px solid #ccc",
                    }}
                  />
                ),
                endAdornment: (
                  <IconButton
                    onClick={() => handlePickerOpen(field)}
                    size="small"
                  >
                    <ColorLensIcon />
                  </IconButton>
                ),
              }}
            />

            {showPicker[field] && (
              <ClickAwayListener onClickAway={() => handlePickerClose(field)}>
                <div
                  style={{
                    position: "absolute",
                    zIndex: 9999,
                    top: "100%",
                    left: 0,
                    backgroundColor: "white",
                    padding: 16,
                    borderRadius: 8,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <ChromePicker
                    color={value}
                    onChange={(color) => {
                      onChange(color.hex);
                      validateHexColor(color.hex, field);
                    }}
                    disableAlpha
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePickerClose(field)}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Choose Color
                  </Button>
                </div>
              </ClickAwayListener>
            )}

            {inputErrors[field] && (
              <FormHelperText error style={{ marginLeft: "10px" }}>
                {inputErrors[field]}
              </FormHelperText>
            )}
          </div>
        )}
      />
    );
  };

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
                  disabled
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
                  error={!!errors.companyType}
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
            <ColorField field="primary" />
            <ColorField field="secondary" />
            <ColorField field="background" />
          </div>
        </div>

        {/* Owner Information Section */}
        {user.role === "SuperAdmin" && (
          <>
            <Divider className="my-6 grid grid-cols-1 md:grid-cols-2" />
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
                      helperText={errors.owner?.name?.message}
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
                      disabled
                      error={!!errors.owner?.email}
                      helperText={errors.owner?.email?.message}
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
                      required
                      error={!!errors.owner?.contact}
                      helperText={errors.owner?.contact?.message}
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
                      required
                      error={!!errors.owner?.cnic}
                      helperText={errors.owner?.cnic?.message}
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
                      required
                      disabled
                      style={{ backgroundColor: "white" }}
                      error={!!errors.owner?.role}
                    >
                      <MenuItem value="" disabled>
                        Select Role
                      </MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>

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
                      disabled
                      required
                      style={{ backgroundColor: "white" }}
                      error={!!errors.owner?.status}
                    >
                      <MenuItem value="" disabled>
                        Select Status
                      </MenuItem>
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
              <div className="col-span-1 md:col-span-2 grid md:grid-cols-2 gap-10">
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
                        id: "setup-openingbalances",
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
                      {
                        id: "utilities-openingbalances",
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

                    {section.children.map((page) => (
                      <div key={page.id} className="flex flex-col">
                        <Typography
                          variant="body2"
                          className="mr-4 font-600 my-4 mb-8"
                        >
                          {page.title}:
                        </Typography>

                        {/* Multi-Select Dropdown */}
                        <Controller
                          name={`pagesAccess.${page.id}`}
                          control={control}
                          render={({ field }) => (
                            <Autocomplete
                              multiple
                              options={permissions}
                              disableCloseOnSelect
                              value={getSelectedPermissions(page.id)}
                              onChange={(_, newValue) =>
                                handlePermissionChange(page.id, newValue)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Permissions"
                                  variant="outlined"
                                  fullWidth
                                />
                              )}
                              renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                  <Checkbox
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                  />
                                  {option}
                                </li>
                              )}
                            />
                          )}
                        />

                        {/* Select All Checkbox */}
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                getSelectedPermissions(page.id).length ===
                                permissions.length
                              }
                              onChange={(e) =>
                                handlePermissionChange(
                                  page.id,
                                  e.target.checked ? permissions : []
                                )
                              }
                            />
                          }
                          label="Select All"
                        />
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

  return <FusePageSimple header={header} content={content} scroll="page" />;
};

export default ProfilePage;
