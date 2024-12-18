import React, { useEffect, useState , useMemo} from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice"; // Assuming message system is used
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import colorNames from './color-names.json'; 

// Assume you have a function for adding/updating company info in your store
// import { addCompanyInfo, updateCompanyInfo } from '../store/companyDataSlice';

const CompanyInfo = () => {
  const title = "Company Information";
  const { control, handleSubmit, formState, setValue, watch } = useForm({
    defaultValues: {
      logo: null,
      name: "",
      email: "",
      address: "",
      website: "",
      area: "",
      subarea: "",
      theme: {
        secondary: "",
        primary: "",
        tableHeaders: "",
      },
    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("You must enter a value"),
        email: yup.string().email().required("You must enter a value"),
        address: yup.string().required("You must enter a value"),
        website: yup.string().url().required("You must enter a value"),
        area: yup.string().required("You must enter a value"),
        subarea: yup.string().required("You must enter a value"),
        theme: yup.object().shape({
          primary: yup.string().required("Select primary color"),
          secondary: yup.string().required("Select secondary color"),
          tableHeaders: yup.string().required("Select table header color"),
        }),
      })
    ),
  });

  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]); // State for colors
  const { isValid, errors } = formState;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch colors from Colormind API on mount
//   useEffect(() => {
//     const fetchColors = async () => {
//         try {
//             const colorCode = "FF0000"; // Red

//             fetch(`https://www.thecolorapi.com/id?hex=${colorCode}&format=json`)
//               .then(response => response.json())
//               .then(data => {
//                 console.log(`Name: ${data.name.value}`);
//                 console.log(`RGB: ${data.rgb.value}`);
//                 console.log(`HSL: ${data.hsl.value}`);
//               });
//           const data = await response.json();
//           setColors(data.name.value); // Assuming the colors are in the 'colors' field of the response
//         } catch (error) {
//           console.error('Error fetching colors:', error);
//         }
//       };
      

//     fetchColors();
//   }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Call your dispatch function for adding or updating company info
      // Example: await dispatch(addCompanyInfo(data));
      // if successful:
      dispatch(showMessage({ message: "Company Info Saved", variant: "success" }));
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
        {/* Logo Upload */}
        <div className="col-span-1 md:col-span-2">
          <Typography variant="h6" gutterBottom>
            Upload Logo
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
        </div>

        {/* Name and Email Fields */}
        <div className="md:col-span-1 col-span-2">
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
              />
            )}
          />
        </div>

        <div className="md:col-span-1 col-span-2">
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
              />
            )}
          />
        </div>

        {/* Location and Website Fields */}
        <div className="md:col-span-1 col-span-2">
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
              />
            )}
          />
        </div>
        <div className="md:col-span-1 col-span-2">
          <Controller
            name="area"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="area"
                variant="outlined"
                fullWidth
                error={!!errors.area}
                helperText={errors?.area?.message}
                required
              />
            )}
          />
        </div>
        <div className="md:col-span-1 col-span-2">
          <Controller
            name="subarea"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Sub Area"
                variant="outlined"
                fullWidth
                error={!!errors.subarea}
                helperText={errors?.subarea?.message}
                required
              />
            )}
          />
        </div>

        <div className="md:col-span-1 col-span-2">
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Website"
                variant="outlined"
                fullWidth
                error={!!errors.website}
                helperText={errors?.website?.message}
                required
              />
            )}
          />
        </div>

        <Divider className="my-6 col-span-1 md:col-span-2" />

        {/* Theme Section */}
        <div className="col-span-2">
          <Typography variant="h6" gutterBottom>
            Theme
          </Typography>
          <div className="flex flex-col md:flex-row gap-4">
            <Controller
              name="theme.secondary"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  className="w-full md:w-1/3"
                >
                  <MenuItem value="" disabled>
                    Secondary Color
                  </MenuItem>
                  {colorOptions.length === 0 ? (
                    <MenuItem disabled>Loading colors...</MenuItem>
                  ) : (
                    colorOptions.map(({ hex, name }) => (
                      <MenuItem key={hex} value={hex}>
                        {name}
                      </MenuItem>
                    ))
                  )}  
                </Select>
              )}
            />

            <Controller
              name="theme.primary"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  className="w-full md:w-1/3"
                >
                  <MenuItem value="" disabled>
                    Primary Color
                  </MenuItem>
                  {colorOptions.length === 0 ? (
                    <MenuItem disabled>Loading colors...</MenuItem>
                  ) : (
                    colorOptions.map(({ hex, name }) => (
                      <MenuItem key={hex} value={hex}>
                        {name}
                      </MenuItem>
                    ))
                  )}  
                </Select>
              )}
            />

            <Controller
              name="theme.tableHeaders"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  className="w-full md:w-1/3"
                >
                  <MenuItem value="" disabled>
                    Table Header Color
                  </MenuItem>
                  {colorOptions.length === 0 ? (
                    <MenuItem disabled>Loading colors...</MenuItem>
                  ) : (
                    colorOptions.map(({ hex, name }) => (
                      <MenuItem key={hex} value={hex}>
                        {name}
                      </MenuItem>
                    ))
                  )}  
                </Select>
              )}
            />
          </div>
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
        {/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            className="whitespace-nowrap"
            color="secondary"
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
