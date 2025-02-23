import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import * as yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "@lodash";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import InputLabel from "@mui/material/InputLabel";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
// import { addRole } from '../store/dataSlice';
// import { PermissionData } from '../Permissions'
import { useAuth } from "../../../auth/AuthContext";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useMemo } from "react";
import { motion } from "framer-motion";
import moment from "moment";
// import { addRecord, getRecords, updateRecord } from '../store/userDataSlice';
import { User } from "../types/dataTypes";
// import { getRecords as getRolesRecords } from '../store/roleDataSlice';
import { useAppDispatch, useAppSelector } from "app/store";
import { useDebounce } from "@fuse/hooks";
import DropdownWidget from "app/shared-components/DropdownWidget";
import { showMessage } from "app/store/fuse/messageSlice";
import { addRecord, getRecords, updateRecord } from "../store/userDataSlice";
import { selectUser } from "app/store/user/userSlice";
import { Divider } from "@mui/material";
import { getRecords as getCompanies } from "../store/utilitiesGroupSlice";

/**
 * UsersFormPage
 */
function UsersFormPage() {
  /**
   * Form Validation Schema
   */

  const title = "Add New User";

  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    address: "",
    // password: '',
    role: "Admin",
    // DateTimePicker: '',
    // DatePicker: ''
  };

  const schema = yup.object().shape({
    name: yup.string().required("You must enter a value"),
    email: yup.string().email().required("You must enter a value"),
    contact: yup.string(),
    cnic: yup.string(),
    photoURL: yup.string(),
    role: yup.string().required("Select a role"),
    // status: yup.string().required("Select a status"),
    pagesAccess: yup.object(),
  });

  const { handleSubmit, register, reset, control, watch, formState, setValue } =
    useForm({
      defaultValues,
      mode: "all",
      resolver: yupResolver(schema),
    });

  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [rowData, setRowData] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const onSubmit = async (formData: User) => {
    try {
      setLoading(true);
      if (id) {
        await dispatch(updateRecord({ id, payload: formData })).then(
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
      } else {
        await dispatch(addRecord({ payload: formData })).then((resp: any) => {
          console.log(resp);
          if (resp.error) {
            dispatch(
              showMessage({ message: resp.error.message, variant: "error" })
            );
          } else {
            dispatch(showMessage({ message: "Success", variant: "success" }));
          }
        });
      }
      setLoading(false);
      navigate(-1);
    } catch (error) {
      console.error("Error handling form submission:", error);
      dispatch(showMessage({ message: error?.message, variant: "error" }));
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const filteredPagesAccess = useMemo(() => {
    if (!user?.pageAccess) return [];

    return Object.entries(user.pageAccess)
      .map(([pageId, permissions]) => {
        // Keep only permissions that are true
        const filteredPermissions = Object.fromEntries(
          Object.entries(permissions).filter(([_, value]) => value === true)
        );

        // If no permissions remain, exclude this page
        if (Object.keys(filteredPermissions).length === 0) return null;

        return { id: pageId, ...filteredPermissions };
      })
      .filter(Boolean); // Remove null values
  }, [user?.pageAccess]);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await dispatch(getRecords({ id }));
          if (response.payload.records.length > 0) {
            const data = response.payload.records[0];
            setRowData(data);

            for (const field in schema.fields) {
              const fieldName: any = field;
              setValue(fieldName, data[fieldName]);
            }
          }
        } catch (error) {
          console.error("Error fetching role data:", error);
        }
      };

      fetchData();
    }
  }, [dispatch, id]);

  const data = watch();

  const permissions = ["Read", "Add", "Update", "Delete"];

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
    const page = watch(`pagesAccess.${pageId}`) || {};
    return permissions.filter((perm) => page[perm.toLowerCase()]);
  };

  const [companies, setCompanies] = useState([]);

  // Fetch companies when the component mounts
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await dispatch(getCompanies({})); // Assume getCompanies() fetches the company list
        console.log("response", response);
        setCompanies(response?.payload?.records);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    }

    fetchCompanies();
  }, [dispatch]);
  console.log("companies", errors,isValid);
  const formContent = (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid sm:grid-cols-2 gap-16 gap-y-40 gap-x-12 lg:w-full w-full  lg:ml-10">
        <Divider className="my-6 col-span-1 md:col-span-2" />

        {/*  Information Section */}
        <div className="col-span-1 md:col-span-2">
          <Typography variant="h6" gutterBottom>
            User Information
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=" Name"
                  variant="outlined"
                  fullWidth
                  error={!!errors?.name}
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
                  label=" Email"
                  variant="outlined"
                  fullWidth
                  error={!!errors?.email}
                  helperText={errors?.email?.message}
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
                  error={!!errors?.contact}
                  helperText={errors?.contact?.message}
                  style={{ backgroundColor: "white" }}
                />
              )}
            />
            <Controller
              name="cnic"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=" CNIC"
                  variant="outlined"
                  fullWidth
                  error={!!errors?.cnic}
                  helperText={errors?.cnic?.message}
                  style={{ backgroundColor: "white" }}
                />
              )}
            />

            <Controller
              name="role"
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
                  <MenuItem value="Employee">Employee</MenuItem>
                </Select>
              )}
            />

            {user.role === "Admin" && (
              <Controller
                name="companyId"
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
                      Select Company
                    </MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company._id} value={company._id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            )}
          </div>
        </div>

        <Divider className="my-6 col-span-1 md:col-span-2" />

        {/* Pages Access Section */}
        <div className="col-span-1 md:col-span-2">
          <Typography variant="h6" gutterBottom>
            Pages Access
          </Typography>
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-10 ">
            {filteredPagesAccess?.map((page) => (
              <div key={page.id} className="border border-b p-10">
                <Typography
                  variant="subtitle1"
                  className="my-4 font-800 capitalize"
                >
                  {page.id.replaceAll("-", " ")}
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
        </div>
      </div>

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
          disabled={ Object.entries(errors).length > 0 || loading}
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
            Keep track of your data
          </Typography>
        </div>
        {/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            className="whitespace-nowrap"
            color="secondary"
            // startIcon={<FuseSvgIcon size={20}>heroicons-solid:cross</FuseSvgIcon>}
            onClick={handleCancel}
          >
            Close
          </Button>
        </div> */}
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
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        };

        return (
          !_.isEmpty(data) && (
            <motion.div
              className="w-full"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-32 w-full mt-32">
                <motion.div
                  variants={item}
                  className="xl:col-span-2 flex flex-col flex-auto"
                >
                  {/* form content here */}

                  {formContent}
                </motion.div>
              </div>
            </motion.div>
          )
        );
      }, [data])}
    </div>
  );

  return <FusePageSimple header={header} content={content} />;
}

export default UsersFormPage;
