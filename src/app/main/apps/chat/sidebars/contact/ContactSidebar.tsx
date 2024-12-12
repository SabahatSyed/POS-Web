import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from "react-hook-form";
import { useContext,useState,useEffect } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { PartialObjectDeep } from "type-fest/source/partial-deep";
import { useAppSelector } from 'app/store';
import { selectContactById } from '../../store/contactsSlice';
import UserAvatar from '../../UserAvatar';
import { ChatAppContext } from '../../ChatApp';
import { useChatContext } from 'stream-chat-react';
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../store/user/userSlice";
import { useAppDispatch } from 'app/store';
import { Autocomplete, Avatar, Checkbox, IconButton,TextField,Button} from "@mui/material";
import _ from "@lodash";

import axios from "axios";
import { ChannelType } from "../../types/ChannelType";

/**
 * The contact sidebar.
 */
function ContactSidebar() {

	const { setContactSidebarOpen } = useContext(ChatAppContext);
	const routeParams = useParams();
	const contactId = routeParams.id;
    const { channel: activeChannel } = useChatContext()
	const userData = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const [msg, setMsg] = useState("");
  //const { data: user } = useAppSelector(selectUser);
  const { control, handleSubmit, reset, formState, watch ,setValue} = useForm({
    mode: "onChange",
  });
  const { isValid, dirtyFields, errors } = formState;
  const [members, setMembers] = useState([]);
  const { client } = useChatContext();
  useEffect(() => {
    async function getData() {
      const response = await axios.get(`/api/scrumboard/members`);
	  console.log("members",response.data.records)
    const formattedMembers = response.data.records.map((member) => ({
      id: member._id,
      name: member.name || "", // Adjust based on the actual structure
    }));
    	  console.log("formmembers",formattedMembers);

    setMembers(formattedMembers);

    }
    getData();
  }, []); // Only dispatch on mount

  const formValues = watch();
useEffect(() => {
  // Check if activeChannel exists
  if (activeChannel) {
    // Extract relevant information from activeChannel and update form state
    setValue("name", activeChannel.data.name || "");
    setValue("image", activeChannel.data.created_by.image || "");

    const formattedMembers = Object.values(activeChannel.state.members).map(
      (member) => ({
        id: member.user.id,
        name: member.user?.name || "", // Adjust based on the actual structure
      })
    );

    // Fetch all members from the API
    const allMembers = members.map((member) => ({
      id: member.id,
      name: member.name || "",
    }));

    // Find the intersection of allMembers and formattedMembers based on 'id'
    console.log("allemenr",allMembers)
        console.log("menr",formattedMembers)

    const preselectedMembers = allMembers.filter((member) =>
      formattedMembers.some((selectedMember) => selectedMember.id === member.id)
    );

    // Set the default values for the 'members' field
    setValue("members", preselectedMembers || []);
  }
}, [activeChannel]);
  async function onSubmit(data: PartialObjectDeep<ChannelType, object>) {
	console.log("sa",data)
  const update = await activeChannel.update(
    {
        name: data.name,
        image:data.image,
        color: 'green',
    },
    { text: 'Thierry changed the channel color to green'},
);
    //	dispatch(updateUserData(data));
   /* const userId = userData.uuid;
    const userName = userData.data.displayName;
    const user = {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
    };
    await client.connectUser(user, client.devToken(userData.uuid));

    try {
      const channel = client.channel("messaging", formValues.name, {
        name: formValues.name,
        members: formValues.members,
      });
      await channel.watch();
      setContactSidebarOpen(false);
    } catch (err) {
      console.error(err);
      setMsg("Channel Name Already Taken");
    }

    /*if (!user || _.isEmpty(formValues)) {
		return null;
	}*/
    //*/
  }

	

	/*if (!contact) {
		return null;
	}
*/
    console.log("channel",activeChannel)
	return (
    <div className="flex flex-col flex-auto h-full">
      <Box
        className="border-b-1"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02),
        }}>
        <Toolbar className="flex items-center px-4">
          <IconButton
            onClick={() => setContactSidebarOpen(false)}
            color="inherit"
            size="large">
            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
          </IconButton>
          <Typography
            className="px-4 font-medium text-16"
            color="inherit"
            variant="subtitle1">
            Channel info
          </Typography>
        </Toolbar>
      </Box>

      <div className="flex flex-col justify-center items-center mt-32">
        {/*<UserAvatar
					className="w-160 h-160 text-64"
					user={contact}
			/>
				<Typography className="mt-16 text-16 font-medium">{contact.name}</Typography>

				<Typography
					color="text.secondary"
					className="mt-2 text-13"
				>
					{contact.about}
			</Typography>*/}
      </div>
      <div className="w-full p-24">
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
                
                className="mt-32"
                options={members || []}
                disableCloseOnSelect
                getOptionLabel={(option) => option?.name}
                renderOption={(_props, option, { selected }) => (
                  <li {..._props}>
                    {console.log(option, selected, _props, "checked")}
                    <Checkbox style={{ marginRight: 8 }} checked={_props?.key === option?.name && !selected} />
                    {option?.name}
                  </li>
                )}
                value={value ? value : []}
                onChange={(event, newValue) => {
                  onChange(newValue.map((item) => item));
                }}
                id="controllable-states-demo"
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Members"
                    placeholder="Members"
                  />
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
            <Button
              onClick={() => setContactSidebarOpen(false)}
              className="mx-8">
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
        {/*{contact.attachments?.media && (
					<>
						<Typography className="mt-16 text-16 font-medium">Media</Typography>
						<div className="grid grid-cols-4 gap-4 mt-16">
							{contact.attachments?.media.map((url, index) => (
								<img
									key={index}
									className="h-80 rounded object-cover"
									src={url}
									alt=""
								/>
							))}
						</div>
					</>
				)}

				<Typography className="mt-40 text-16 font-medium">Details</Typography>

				<div className="mt-16">
					<Typography
						className="text-14 font-medium"
						color="text.secondary"
					>
						Emails
					</Typography>

					{contact.details.emails?.map((item, index) => (
						<div
							className="flex items-center"
							key={index}
						>
							<Typography>{item.email}</Typography>
							{item.label && (
								<Typography
									className="text-md truncate"
									color="text.secondary"
								>
									<span className="mx-8">&bull;</span>
									<span className="font-medium">{item.label}</span>
								</Typography>
							)}
						</div>
					))}
				</div>

				<div className="mt-16">
					<Typography
						className="text-14 font-medium"
						color="text.secondary"
					>
						Phone numbers
					</Typography>

					{contact.details.phoneNumbers?.map((item, index) => (
						<div
							className="flex items-center"
							key={index}
						>
							<Typography>{item.phoneNumber}</Typography>
							{item.label && (
								<Typography
									className="text-md truncate"
									color="text.secondary"
								>
									<span className="mx-8">&bull;</span>
									<span className="font-medium">{item.label}</span>
								</Typography>
							)}
						</div>
					))}
				</div>

				<div className="mt-16">
					<Typography
						className="text-14 font-medium"
						color="text.secondary"
					>
						Title
					</Typography>

					<Typography>{contact.details.title}</Typography>
				</div>

				<div className="mt-16">
					<Typography
						className="text-14 font-medium"
						color="text.secondary"
					>
						Company
					</Typography>

					<Typography>{contact.details.company}</Typography>
				</div>

				<div className="mt-16">
					<Typography
						className="text-14 font-medium"
						color="text.secondary"
					>
						Birthday
					</Typography>

					<Typography>{format(new Date(contact.details.birthday), 'P')}</Typography>
				</div>

				<div className="mt-16">
					<Typography
						className="text-14 font-medium"
						color="text.secondary"
					>
						Address
					</Typography>

					<Typography>{contact.details.address}</Typography>
				</div>
							*/}
      </div>
    </div>
  );
}

export default ContactSidebar;
