import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import { showMessage } from "app/store/fuse/messageSlice";
import { useAuth } from "../../../auth/AuthContext";
import { useAppSelector } from "app/store";
import { CircularProgress, MenuItem, Typography } from "@mui/material";
import { selectUser } from "app/store/user/userSlice";
import { addRecord, getRecords, updateRecord } from "../store/keypointsSlice";

function KeypointsFormPage() {
  const user = useAppSelector(selectUser); // Get the logged-in user
  
  const companyType = user?.companyType; // Get the company type of the user

  const title =
    companyType === "optics" ? "Optics Form" : "Tailor Measurements Form";

  // Default values for the form
  const defaultValues = {
    name: "",
    gender: "",
    age: "",
    ...(companyType === "optics" && {
      typeOfLenses: "",
      checkupAfter: "",
      leftEye: { sph: "", cyl: "", axis: "", va: "" },
      rightEye: { sph: "", cyl: "", axis: "", va: "" },
    }),
    ...(companyType === "tailor" && {
      shoulders: 0,
      neck: 0,
      chest: 0,
      waist: 0,
      hips: 0,
      arms: 0,
      shirtLength: 0,
      trouserLength: 0,
    }),
  };

  // Validation schema for the form
  const schema = yup.object().shape({
    name: yup.string().required("You must enter a value"),
    gender: yup.string().required("You must enter a value"),
    age: yup.number().required("You must enter a value").positive().integer(),

    ...(companyType === "optics" && {
      typeOfLenses: yup.string().notRequired(),
      checkupAfter: yup.string().notRequired(),

      D_V: yup.object().shape({
        leftEye: yup.object().shape({
          sph: yup.string().notRequired(),
          cyl: yup.string().notRequired(),
          axis: yup.string().notRequired(),
          va: yup.string().notRequired(),
        }),
        rightEye: yup.object().shape({
          sph: yup.string().notRequired(),
          cyl: yup.string().notRequired(),
          axis: yup.string().notRequired(),
          va: yup.string().notRequired(),
        }),
      }),

      N_V: yup.object().shape({
        leftEye: yup.object().shape({
          sph: yup.string().notRequired(),
          cyl: yup.string().notRequired(),
          axis: yup.string().notRequired(),
          va: yup.string().notRequired(),
        }),
        rightEye: yup.object().shape({
          sph: yup.string().notRequired(),
          cyl: yup.string().notRequired(),
          axis: yup.string().notRequired(),
          va: yup.string().notRequired(),
        }),
      }),
    }),

    ...(companyType === "tailor" && {
      shoulders: yup.number().notRequired().positive(),
      neck: yup.number().notRequired().positive(),
      chest: yup.number().notRequired().positive(),
      waist: yup.number().notRequired().positive(),
      hips: yup.number().notRequired().positive(),
      arms: yup.number().notRequired().positive(),
      shirtLength: yup.number().notRequired().positive(),
      trouserLength: yup.number().notRequired().positive(),
    }),
  });

  const { handleSubmit, register, reset, control, watch, formState, setValue } =
    useForm({
      defaultValues,
      mode: "all",
      resolver: yupResolver(schema),
    });

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(false);
  const { isValid, errors } = formState;

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      if (id) {
        await dispatch(updateRecord({ id, payload: formData })).then((resp) => {
          if (resp.error) {
            dispatch(
              showMessage({ message: resp.error.message, variant: "error" })
            );
          } else {
            dispatch(showMessage({ message: "Success", variant: "success" }));
            reset();
          }
        });
      } else {
        await dispatch(addRecord({ payload: formData })).then((resp) => {
          if (resp.error) {
            dispatch(
              showMessage({ message: resp.error.message, variant: "error" })
            );
          } else {
            dispatch(showMessage({ message: "Success", variant: "success" }));
            reset();
          }
        });
      }
      setLoading(false);
	  navigate(-1)
    } catch (error) {
      console.error("Error handling form submission:", error);
      dispatch(showMessage({ message: error?.message, variant: "error" }));
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
	if (id) {

		const fetchData = async () => {
			try {
				const response = await dispatch(getRecords({ id }));
				if (response.payload.records.length > 0) {

					const data = response.payload.records[0];
					console.log("data",data)
					for (const field in schema.fields) {
						const fieldName: any = field;
						setValue(fieldName, data.keypoints[fieldName]);
					}
				}

			} catch (error) {
				console.error('Error fetching role data:', error);
			}
		};

		fetchData();
	}
}, [dispatch, id]);

  const data = watch();

  const renderOpticsForm = () => (
    <div>
      <div className="grid sm:grid-cols-2 gap-16 gap-y-40 gap-x-12 lg:w-full w-full lg:ml-10">
        {/* Name, Gender, Age */}
        <div className="sm:col-span-1">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                variant="outlined"
                className="bg-white"
                error={!!errors.name}
                helperText={errors?.name?.message}
                required
                fullWidth
              />
            )}
          />
        </div>
        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Gender"
                variant="outlined"
                className=" bg-white"
                error={!!errors.gender}
                helperText={errors?.gender?.message}
                required
                fullWidth
              >
                <MenuItem value={'Male'}>Male</MenuItem>
                <MenuItem value={'Female'}>Female</MenuItem>
              </TextField>
            )}
            name="gender"
            control={control}
          />
        </div>
        <div className="sm:col-span-1">
          <Controller
            name="age"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Age"
                variant="outlined"
                className="bg-white"
                error={!!errors.age}
                helperText={errors?.age?.message}
                required
                fullWidth
              />
            )}
          />
        </div>

        {/* Type of Lenses, Checkup After */}
        <div className="sm:col-span-1">
          <Controller
            name="typeOfLenses"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Type of Lenses"
                variant="outlined"
                className="bg-white"
                error={!!errors.typeOfLenses}
                helperText={errors?.typeOfLenses?.message}
                fullWidth
              />
            )}
          />
        </div>
        <div className="sm:col-span-1">
          <Controller
            name="checkupAfter"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Comeback for Checkup After"
                variant="outlined"
                className="bg-white"
                error={!!errors.checkupAfter}
                helperText={errors?.checkupAfter?.message}
                fullWidth
              />
            )}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-16 gap-y-40 gap-x-12 lg:w-full w-full lg:ml-10 mt-20">
        {/* Distance Vision (D_V) */}
        <div className="flex flex-col gap-10">
          <Typography variant="h6" className="mb-16">
            Distance Vision (D.V)
          </Typography>

          {/* Left Eye - Distance Vision */}
          <Controller
            name="D_V.leftEye.sph"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Left Eye SPH"
                variant="outlined"
                className="bg-white"
                error={!!errors?.D_V?.leftEye?.sph}
                helperText={errors?.D_V?.leftEye?.sph?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="D_V.leftEye.cyl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Left Eye CYL"
                variant="outlined"
                className="bg-white"
                error={!!errors?.D_V?.leftEye?.cyl}
                helperText={errors?.D_V?.leftEye?.cyl?.message}
                
                fullWidth
              />
            )}
          />
          <Controller
            name="D_V.leftEye.axis"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Left Eye AXIS"
                variant="outlined"
                className="bg-white"
                error={!!errors?.D_V?.leftEye?.axis}
                helperText={errors?.D_V?.leftEye?.axis?.message}
                
                fullWidth
              />
            )}
          />
          <Controller
            name="D_V.leftEye.va"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Left Eye V.A"
                variant="outlined"
                className="bg-white"
                error={!!errors?.D_V?.leftEye?.va}
                helperText={errors?.D_V?.leftEye?.va?.message}
                
                fullWidth
              />
            )}
          />

          {/* Right Eye - Distance Vision */}
          <Controller
            name="D_V.rightEye.sph"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Right Eye SPH"
                variant="outlined"
                className="bg-white"
                error={!!errors?.D_V?.rightEye?.sph}
                helperText={errors?.D_V?.rightEye?.sph?.message}
                
                fullWidth
              />
            )}
          />
          <Controller
            name="D_V.rightEye.cyl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Right Eye CYL"
                variant="outlined"
                className="bg-white"
                error={!!errors?.D_V?.rightEye?.cyl}
                helperText={errors?.D_V?.rightEye?.cyl?.message}
                
                fullWidth
              />
            )}
          />
          <Controller
            name="D_V.rightEye.axis"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Right Eye AXIS"
                variant="outlined"
                className="bg-white"
                error={!!errors?.D_V?.rightEye?.axis}
                helperText={errors?.D_V?.rightEye?.axis?.message}
                
                fullWidth
              />
            )}
          />
          <Controller
            name="D_V.rightEye.va"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Right Eye V.A"
                variant="outlined"
                className="bg-white"
                error={!!errors?.D_V?.rightEye?.va}
                helperText={errors?.D_V?.rightEye?.va?.message}
                
                fullWidth
              />
            )}
          />
        </div>

        {/* Near Vision (N_V) */}
        <div className="flex flex-col gap-10">
          <Typography variant="h6" className="mb-16">
            Near Vision (N.V)
          </Typography>

          {/* Left Eye - Near Vision */}
          <Controller
            name="N_V.leftEye.sph"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Left Eye SPH"
                variant="outlined"
                className="bg-white"
                error={!!errors?.N_V?.leftEye?.sph}
                helperText={errors?.N_V?.leftEye?.sph?.message}
                
                fullWidth
              />
            )}
          />
          <Controller
            name="N_V.leftEye.cyl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Left Eye CYL"
                variant="outlined"
                className="bg-white"
                error={!!errors?.N_V?.leftEye?.cyl}
                helperText={errors?.N_V?.leftEye?.cyl?.message}
                
                fullWidth
              />
            )}
          />
          <Controller
            name="N_V.leftEye.axis"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Left Eye AXIS"
                variant="outlined"
                className="bg-white"
                error={!!errors?.N_V?.leftEye?.axis}
                helperText={errors?.N_V?.leftEye?.axis?.message}
                
                fullWidth
              />
            )}
          />
          <Controller
            name="N_V.leftEye.va"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Left Eye V.A"
                variant="outlined"
                className="bg-white"
                error={!!errors?.N_V?.leftEye?.va}
                helperText={errors?.N_V?.leftEye?.va?.message}
                
                fullWidth
              />
            )}
          />

          {/* Right Eye - Near Vision */}
          <Controller
            name="N_V.rightEye.sph"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Right Eye SPH"
                variant="outlined"
                className="bg-white"
                error={!!errors?.N_V?.rightEye?.sph}
                helperText={errors?.N_V?.rightEye?.sph?.message}
                
                fullWidth
              />
            )}
          />
          <Controller
            name="N_V.rightEye.cyl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Right Eye CYL"
                variant="outlined"
                className="bg-white"
                error={!!errors?.N_V?.rightEye?.cyl}
                helperText={errors?.N_V?.rightEye?.cyl?.message}
                
                fullWidth
              />
            )}
          />
          <Controller
            name="N_V.rightEye.axis"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Right Eye AXIS"
                variant="outlined"
                className="bg-white"
                error={!!errors?.N_V?.rightEye?.axis}
                helperText={errors?.N_V?.rightEye?.axis?.message}
                
                fullWidth
              />
            )}
          />
          <Controller
            name="N_V.rightEye.va"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Right Eye V.A"
                variant="outlined"
                className="bg-white"
                error={!!errors?.N_V?.rightEye?.va}
                helperText={errors?.N_V?.rightEye?.va?.message}
                
                fullWidth
              />
            )}
          />
        </div>
      </div>
    </div>
  );

  const renderTailorForm = () => (
    <div className="grid sm:grid-cols-2 gap-16 gap-y-40 gap-x-12 lg:w-full w-full lg:ml-10">
      {/* Name, Gender, Age */}
      <div className="sm:col-span-1">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              variant="outlined"
              className="bg-white"
              error={!!errors.name}
              helperText={errors?.name?.message}
              required
              fullWidth
            />
          )}
        />
      </div>
      <div className="sm:col-span-1">
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Gender"
              variant="outlined"
              className="bg-white"
              error={!!errors.gender}
              helperText={errors?.gender?.message}
              required
              fullWidth
            />
          )}
        />
      </div>
      <div className="sm:col-span-1">
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Age"
              variant="outlined"
              className="bg-white"
              error={!!errors.age}
              helperText={errors?.age?.message}
              required
              fullWidth
            />
          )}
        />
      </div>
	  <div></div>

      {/* Tailor Measurements */}
      <div className="sm:col-span-1">
        <Controller
          name="shoulders"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Shoulders (cm)"
              variant="outlined"
              className="bg-white"
              type="number"
              error={!!errors.shoulders}
              helperText={errors?.shoulders?.message}
              
              fullWidth
            />
          )}
        />
      </div>
      <div className="sm:col-span-1">
        <Controller
          name="neck"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Neck (cm)"
              variant="outlined"
              className="bg-white"
              type="number"
              error={!!errors.neck}
              helperText={errors?.neck?.message}
              
              fullWidth
            />
          )}
        />
      </div>
      <div className="sm:col-span-1">
        <Controller
          name="chest"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Chest (cm)"
              variant="outlined"
              className="bg-white"
              type="number"
              error={!!errors.chest}
              helperText={errors?.chest?.message}
              
              fullWidth
            />
          )}
        />
      </div>
      <div className="sm:col-span-1">
        <Controller
          name="waist"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Waist (cm)"
              variant="outlined"
              className="bg-white"
              type="number"
              error={!!errors.waist}
              helperText={errors?.waist?.message}
              
              fullWidth
            />
          )}
        />
      </div>
      <div className="sm:col-span-1">
        <Controller
          name="hips"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Hips (cm)"
              variant="outlined"
              className="bg-white"
              type="number"
              error={!!errors.hips}
              helperText={errors?.hips?.message}
              
              fullWidth
            />
          )}
        />
      </div>
      <div className="sm:col-span-1">
        <Controller
          name="arms"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Arms (cm)"
              variant="outlined"
              className="bg-white"
              type="number"
              error={!!errors.arms}
              helperText={errors?.arms?.message}
              
              fullWidth
            />
          )}
        />
      </div>
      <div className="sm:col-span-1">
        <Controller
          name="shirtLength"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Shirt Length (cm)"
              variant="outlined"
              className="bg-white"
              type="number"
              error={!!errors.shirtLength}
              helperText={errors?.shirtLength?.message}
              
              fullWidth
            />
          )}
        />
      </div>
      <div className="sm:col-span-1">
        <Controller
          name="trouserLength"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Trouser Length (cm)"
              variant="outlined"
              className="bg-white"
              type="number"
              error={!!errors.trouserLength}
              helperText={errors?.trouserLength?.message}
              
              fullWidth
            />
          )}
        />
      </div>
    </div>
  );

  const formContent = (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      {companyType === "optics" ? renderOpticsForm() : renderTailorForm()}
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
            Keep track of your data
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
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        };

        return (
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
                {formContent}
              </motion.div>
            </div>
          </motion.div>
        );
      }, [data])}
    </div>
  );

  return <FusePageSimple header={header} content={content} />;
}

export default KeypointsFormPage;
