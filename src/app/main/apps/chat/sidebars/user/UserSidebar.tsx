import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import InputAdornment from '@mui/material/InputAdornment';
import { lighten } from '@mui/material/styles';
import { useAppDispatch, useAppSelector  } from 'app/store';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';
import Statuses from '../../Statuses';
import UserAvatar from '../../UserAvatar';
import { ChatAppContext } from '../../ChatApp';
import { ChannelType } from '../../types/ChannelType';
import { Autocomplete, Avatar, Checkbox, IconButton } from '@mui/material';
import { selectAllScrumboardMembers  , getMembers} from '../../../../sales-management/scrumboard/store/membersSlice';
import { useSelector } from 'react-redux';
import { CoPresentOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useChatContext } from 'stream-chat-react';
import { selectUser } from "../../../../../store/user/userSlice";

/**
 * The user sidebar.
 */
function UserSidebar() {
	const { setUserSidebarOpen } = useContext(ChatAppContext);
	const userData = useSelector(selectUser);
	const dispatch = useAppDispatch();
	const [msg,setMsg] = useState('')
	//const { data: user } = useAppSelector(selectUser);
	const { control, handleSubmit, reset, formState, watch } = useForm({mode:'onChange'});
	const { isValid, dirtyFields, errors } = formState;
	const [members,setMembers] = useState([])
	const {client} = useChatContext()
	useEffect(() => {
		async function getData(){

		const response = await axios.get(`/api/scrumboard/members`);
		setMembers(response.data.records)
	
		}
		getData()
	},[]) // Only dispatch on mount
	
	const formValues = watch();

	async function onSubmit(data: PartialObjectDeep<ChannelType, object>) {
    //	dispatch(updateUserData(data));
    const userId = userData.uuid;
    const userName = userData.data.displayName;
    const user = {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
    };
    await client.connectUser(user, client.devToken(userData.uuid));

    try{
	
	  const channel = client.channel("messaging", formValues.name, {
      image:
        formValues.image ,
      name: formValues.name,
      members: formValues.members,
    });
    await channel.watch();
	setUserSidebarOpen(false);
}
	catch(err){
		console.error(err)
		setMsg("Channel Name Already Taken")
	}

    /*if (!user || _.isEmpty(formValues)) {
		return null;
	}*/
	//
  }

	

	return (
    <div className="flex flex-col flex-auto h-full ">
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02),
        }}>
        <Toolbar className="flex items-center px-24 border-b-1">
          <IconButton onClick={() => setUserSidebarOpen(false)}>
            <FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>
          </IconButton>
          <Typography className="px-8 font-semibold text-20">
            Profile
          </Typography>
        </Toolbar>
      </Box>

      <div className="flex flex-col justify-center items-center py-32">
        {/* <UserAvatar
					className="w-160 h-160 text-64"
					//user={user}
			/>*/}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-24 flex flex-col gap-10">
        <Controller
          control={control}
          name="image"
          render={({ field: { onChange, value } }) => (
            <Box
              sx={{
                borderWidth: 4,
                borderStyle: "solid",
                borderColor: "background.paper",
              }}
              className="relative mx-auto flex items-center justify-center w-128 h-128 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div>
                  <label htmlFor="image" className="flex p-8 cursor-pointer">
                    <input
                      accept="image/*"
                      className="hidden"
                      id="image"
                      type="file"
                      onChange={async (e) => {
                        function readFileAsync() {
                          return new Promise((resolve, reject) => {
                            const file = e?.target?.files?.[0];
                            if (!file) {
                              return;
                            }
                            const reader: FileReader = new FileReader();

                            reader.onload = () => {
                              if (typeof reader.result === "string") {
                                resolve(
                                  `data:${file.type};base64,${btoa(
                                    reader.result
                                  )}`
                                );
                              } else {
                                reject(
                                  new Error(
                                    "File reading did not result in a string."
                                  )
                                );
                              }
                            };

                            reader.onerror = reject;

                            reader.readAsBinaryString(file);
                          });
                        }

                        const newImage = await readFileAsync();

                        onChange(newImage);
                      }}
                    />
                    <FuseSvgIcon className="text-white">
                      heroicons-outline:camera
                    </FuseSvgIcon>
                  </label>
                </div>
                <div>
                  <IconButton
                    onClick={() => {
                      onChange("");
                    }}>
                    <FuseSvgIcon className="text-white">
                      heroicons-solid:trash
                    </FuseSvgIcon>
                  </IconButton>
                </div>
              </div>
              <Avatar
                sx={{
                  backgroundColor: "background.default",
                  color: "text.secondary",
                }}
                className="object-cover w-full h-full text-64 font-bold"
                src={value}></Avatar>
            </Box>
          )}
        />
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              label="Channel Name"
              variant="outlined"
              className="bg-white"
              error={!!errors.name}
              helperText={errors?.name?.message as string}
              required
              fullWidth
            />
          )}
          name="name"
          control={control}
        />
        <p className=" text-sm ">{msg}</p>
        <Controller
          control={control}
          name="members"
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              multiple
              id="members"
              className="mt-32"
              options={members || []}
              disableCloseOnSelect
              getOptionLabel={(option) => option?.name}
              renderOption={(_props, option, { selected }) => (
                <li {..._props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option?.name}
                </li>
              )}
              value={value ? value.map((id) => _.find(members, { id })) : []}
              onChange={(event, newValue) => {
                onChange(newValue.map((item) => item.id));
              }}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Members" placeholder="Members" />
              )}
            />
          )}
        />

        {/*<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<TextField
							className="w-full"
							{...field}
							label="Name"
							placeholder="Name"
							id="name"
							error={!!errors.name}
							helperText={errors?.name?.message as string}
							variant="outlined"
							required
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:user-circle</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-16 w-full"
							label="Email"
							placeholder="Email"
							variant="outlined"
							fullWidth
							error={!!errors.email}
							helperText={errors?.email?.message as string}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>

				<Controller
					name="about"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="About"
							className="mt-16 w-full"
							margin="normal"
							multiline
							variant="outlined"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:identification</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
						/>*/}

        {/* <FormControl
					component="fieldset"
					className="w-full mt-16"
				>
					<FormLabel component="legend">Status</FormLabel>
					<Controller
						name="status"
						control={control}
						render={({ field }) => (
							<RadioGroup
								{...field}
								aria-label="Status"
								name="status"
							>
								{Statuses.map((status) => (
									<FormControlLabel
										key={status.value}
										value={status.value}
										control={<Radio />}
										label={
											<div className="flex items-center">
												<Box
													className="w-8 h-8 rounded-full"
													sx={{ backgroundColor: status.color }}
												/>
												<span className="mx-8">{status.title}</span>
											</div>
										}
									/>
								))}
							</RadioGroup>
						)}
					/>
				</FormControl> */}
        <div className="flex items-center justify-end mt-32">
          <Button onClick={() => setUserSidebarOpen(false)} className="mx-8">
            Cancel
          </Button>
          <Button
            className="mx-8"
            variant="contained"
            color="secondary"
            disabled={
              _.isEmpty(dirtyFields) ||
              !isValid ||
              _.isEmpty(formValues.members)
            }
            onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UserSidebar;
