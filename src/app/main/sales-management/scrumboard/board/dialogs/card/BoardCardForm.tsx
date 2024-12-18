// import { useDebounce } from '@fuse/hooks';
import { useDebounce } from "usehooks-ts";
import { Link } from 'react-router-dom';
import _ from "@lodash";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import clsx from "clsx";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TrendChart from "../../../../details/myChart"
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from '@mui/system/Stack';
import Alert from '@mui/material/Alert';
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { CircularProgress } from '@mui/material';
import Autocomplete from "@mui/material/Autocomplete";
import fromUnixTime from "date-fns/fromUnixTime";
import getUnixTime from "date-fns/getUnixTime";
import format from "date-fns/format";
import { Controller, useForm } from "react-hook-form";
import { SyntheticEvent, useEffect, useState, useRef, ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "app/store";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import {
  acceptTerms,
  closeCardDialog,
  removeCard,
  selectCardData,
  updateCard,
} from "../../../store/cardSlice";
import CardActivity from "./activity/CardActivity";
import CardAttachment from "./attachment/CardAttachment";
import CardChecklist from "./checklist/CardChecklist";
import CardComment from "./comment/CardComment";
import { selectListById } from "../../../store/listsSlice";
import { selectLabels } from "../../../store/labelsSlice";
import { selectBoard } from "../../../store/boardSlice";
import { selectMembers } from "../../../store/membersSlice";
import DueMenu from "./toolbar/DueMenu";
import LabelsMenu from "./toolbar/LabelsMenu";
import MembersMenu from "./toolbar/MembersMenu";
import CheckListMenu from "./toolbar/CheckListMenu";
import OptionsMenu from "./toolbar/OptionsMenu";
import { CardType } from "../../../types/CardType";
import { BoardType } from "../../../types/BoardType";
import { LabelType, LabelsType } from "../../../types/LabelType";
import { MemberType, MembersType } from "../../../types/MemberType";
import { ChecklistsType } from "../../../types/ChecklistType";
import { CommentsType } from "../../../types/CommentType";
import { AttachmentType } from '../../../types/AttachmentType';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import FuseUtils from '@fuse/utils/FuseUtils';
import ActivityModel from '../../../models/ActivityModel';
import { Timeline } from '@mui/lab';
import ActivityTimelineItem from './activity/ActivityTimelineItem';
import { DealData } from '../../../types/DealDataType';
import StockCardEntery from './stocksDetail/StockInfoEnteries';
import StockCalculations from './stocksDetail/StockCalculations';
import StockTermDetail from './stocksDetail/StockTermDetail';
/**
 * The board card form component.
 */
function BoardCardForm() {
  const dispatch = useAppDispatch();
  const { data: board } = useAppSelector(selectBoard);
  const labels = useAppSelector(selectLabels);
  const members = useAppSelector(selectMembers);
  const card = useAppSelector(selectCardData) as CardType;
  const list = useAppSelector(selectListById(card?.listId));

  const { register, watch, control, setValue } = useForm<CardType>({
    mode: "onChange",
    defaultValues: card,
  });

  const cardForm = watch();
  const deal_data: DealData = JSON.parse(cardForm?.deal_data)
  const [cardData, setCardData] = useState<CardType>(null);
  const [fileUploadLoading, setFileUploadLoading] = useState<boolean>(false);
  const debouncedValue = useDebounce<CardType>(cardData, 600);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType === 'application/pdf') {
      return 'pdf';
    } else if (mimeType.startsWith('application/msword') || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'word';
    } else {
      // Add more cases for other file types if needed
      return 'unknown';
    }
  };
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    try {
      setFileUploadLoading(true);

      const allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      const uploadedAttachments = await Promise.all(
        Array.from(files!).map(async (file, index) => {
          if (allowedFileTypes.includes(file.type)) {
            const timestamp = Date.now();
            const response = await uploadToS3(file, timestamp);
            const fileType = getFileType(file.type);
            return {
              id: FuseUtils.generateGUID(),
              name: file.name,
              src: response.url!,
              time: timestamp,
              type: fileType,
              url: response.url!,
            } as AttachmentType;
          } else {
            console.error('Invalid file type:', file.type);
            return null;
          }
        })
      );

      const validAttachments = uploadedAttachments.filter((attachment) => attachment !== null);
      setValue("attachments", [...cardForm.attachments, ...validAttachments]);
      setValue("activities", [...cardForm.activities, ActivityModel({ description: `New attachment added: ${validAttachments.map(item => item.name).join(', ')}`, icon: 'heroicons-outline:paper-clip' })])
    } catch (error) {
      console.error('Error uploading files', error);
    } finally {
      setFileUploadLoading(false);
    }
  };

  const s3 = new S3Client({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

  const uploadToS3 = async (file: File, timestamp: number) => {
    try {
      const fileName = `${cardForm.id}_${cardForm.boardId}_${timestamp}_${file.name}`
      const params = {
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
        Key: `${process.env.REACT_APP_AWS_S3_BUCKET_FOLDER}/${fileName}`,
        Body: file,
        ContentType: file.type,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      const url = `https://${process.env.REACT_APP_AWS_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${process.env.REACT_APP_AWS_S3_BUCKET_FOLDER}/${fileName}`;

      return { url };
    } catch (error) {
      console.error('Error uploading to AWS S3:', error);
    }
  };

  const handleRemoveAttachment = async (item: AttachmentType) => {
    try {
      await removeFromS3(item.url);
      setValue(
        "attachments",
        _.reject(cardForm.attachments, { id: item.id })
      );
      setValue("activities", [...cardForm.activities, ActivityModel({ description: `Attachment removed: ${item.name}`, icon: 'heroicons-outline:paper-clip' })])
    } catch (error) {
      console.error('Error removing attachment:', error);
    }
  };

  const removeFromS3 = async (url: string) => {
    try {
      const fileName = url.split('/').pop();

      const params = {
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
        Key: `${process.env.REACT_APP_AWS_S3_BUCKET_FOLDER}/${fileName}`,
      };
      await s3.send(new DeleteObjectCommand(params));
    } catch (error) {
      console.error('Error removing from S3:', error);
      throw error; // rethrow the error so that it can be handled further if needed
    }
  };

  // Fetch API (optional)
  useEffect(() => {
    // Do fetch here...
    // Triggers when "debouncedValue" changes

    dispatch(updateCard(cardData));
  }, [debouncedValue]);

  useEffect(() => {
    if (!card) {
      return;
    }

    if (!_.isEqual(cardData, cardForm)) {
      setCardData(cardForm);
    }
  }, [card, cardForm]);

  useEffect(() => {
    register("attachmentCoverId");
  }, [register]);

  if (!card && !board) {
    return null;
  }

  return (
    <DialogContent className="flex flex-col sm:flex-row px-8 py-0">
      <div className="py-16 flex items-center bg-white border-b shadow-sm z-30 absolute top-60 left-10 right-10 sm:top-0 sm:left-24 sm:right-80">
        <Typography className={`font-semibold text-lg mr-8 ${card?.transaction_type === 'BORRO' ? 'text-borrowColor' : card?.transaction_type === 'Private Block Purchase' ? 'text-privateBolckColor' : card?.transaction_type === 'Equity Lines of Credit' ? 'text-equityColor' : ''}`}>{card?.transaction_type}</Typography>
        <Typography>{board.title}</Typography>
        <FuseSvgIcon size={20}>heroicons-outline:chevron-right</FuseSvgIcon>
        <Typography>{list && list.title}</Typography>
      </div>
      <div className="flex flex-auto flex-col py-88 px-0 sm:px-16">
        <div className="flex flex-col sm:flex-row sm:justify-between justify-start items-start mb-24">
          <div className="mb-16 sm:mb-0 flex items-center">
            <Avatar
              className="flex-0 w-48 h-48"
              alt="user photo"
              src={cardForm?.photoURL}
            >
              {cardForm?.name[0]}
            </Avatar>
            <div className="flex flex-col min-w-0 mx-10">
              <Typography className="text-base font-bold tracking-tight">
                {cardForm.name}
              </Typography>
              <Typography
                className="text-sm"
                color="text.secondary"
              >
                {cardForm.phone}
              </Typography>
            </div>
          </div>

          {cardForm.dueDate && (
            <DateTimePicker
              value={new Date(format(fromUnixTime(cardForm.dueDate), "Pp"))}
              format="Pp"
              onChange={(val) => setValue("dueDate", getUnixTime(val))}
              className="w-full sm:w-auto"
              slotProps={{
                textField: {
                  label: "Due date",
                  placeholder: "Choose a due date",
                  InputLabelProps: {
                    shrink: true,
                  },
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
          )}
        </div>
        {/* <div className="m-10 w-fit mb-20 rounded-3xl  p-10 text-white bg-blue-800">
          Default Text Notification
        </div> */}

        <Stack sx={{ width: '100%' }} spacing={4} paddingBottom={4} >
          {!cardForm.accepted_date && (
            <Alert severity="warning" className='flex items-center'>Default Terms Notification —
              <Button onClick={() => dispatch(acceptTerms())} className='ml-4'>please review!</Button>
            </Alert>
          )}

          <Accordion className="mb-4 !rounded-xl border border-gray-300 shadow-none overflow-hidden">
            <AccordionSummary
              expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
              aria-controls="graph-section-content"
              id="graph-section-header"
            >
              <FuseSvgIcon className='mt-2' size={20}>heroicons-outline:credit-card</FuseSvgIcon>
              <Typography className="font-semibold text-16 mx-8">
                Stock Info
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-col gap-8 flex-auto width-full">
                <div className='flex gap-5 items-center justify-center mb-10'>
                  <Typography className="font-semibold text-18">
                    {cardForm?.stock}
                  </Typography>
                  <Typography className="font-md text-14 text-gray-600 ">
                    {cardForm?.company}
                  </Typography>
                </div>
                <StockCardEntery name='Market Cap' value={cardForm?.market_cap?.toLocaleString() || '-'} />
                <StockCardEntery name='Share Price' value={cardForm?.share_price?.toLocaleString() || '-'} showDollarSign={true} />
                <TrendChart />
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion className="mb-4 !rounded-xl border border-gray-300 shadow-none overflow-hidden">
            <AccordionSummary
              expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
              aria-controls="graph-section-content"
              id="graph-section-header"
            >
              <FuseSvgIcon className='mt-2' size={20}>heroicons-outline:map</FuseSvgIcon>
              <Typography className="font-semibold text-16 mx-8">
                Stock Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails className='flex flex-col gap-20'>
              <StockCalculations deal_data={deal_data} />
              <StockTermDetail deal_data={deal_data} />
            </AccordionDetails>
          </Accordion>

          {/* <div className="flex items-center">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  type="text"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={true}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {card?.subscribed && (
                          <FuseSvgIcon size={20} color="action">
                            heroicons-outline:eye
                          </FuseSvgIcon>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div> */}

          <div className="w-full">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  rows="4"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>

          {cardForm.labels && cardForm.labels.length > 0 && (
            <div className="flex-1">
              <div className="flex items-center">
                <FuseSvgIcon size={20}>heroicons-outline:tag</FuseSvgIcon>
                <Typography className="font-semibold text-16 mx-8">
                  Labels
                </Typography>
              </div>
              <Autocomplete
                className="mt-8 "
                multiple
                freeSolo
                options={labels}
                getOptionLabel={(option: string | LabelType) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  return option?.title;
                }}
                value={
                  cardForm.labels.map((id) =>
                    _.find(labels, { id })
                  ) as LabelsType
                }
                onChange={(
                  event: SyntheticEvent<Element, Event>,
                  value: (string | LabelType)[]
                ) => {
                  const ids = value
                    .filter((item): item is LabelType => typeof item !== "string")
                    .map((item) => item.id);
                  setValue("labels", ids);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    return (
                      <Chip
                        label={typeof option === "string" ? option : option.title}
                        {...getTagProps({ index })}
                        className="m-3"
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select multiple Labels"
                    label="Labels"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </div>
          )}

          {cardForm.memberIds && cardForm.memberIds.length > 0 && (
            <div className="flex-1">
              <div className="flex items-center ">
                <FuseSvgIcon size={20}>heroicons-outline:users</FuseSvgIcon>
                <Typography className="font-semibold text-16 mx-8">
                  Members
                </Typography>
              </div>
              <Autocomplete
                className="mt-8"
                multiple
                freeSolo
                options={members}
                getOptionLabel={(member: string | MemberType) => {
                  return typeof member === "string" ? member : member?.name;
                }}
                value={
                  cardForm.memberIds.map((id) =>
                    _.find(members, { id })
                  ) as MembersType
                }
                onChange={(
                  event: SyntheticEvent<Element, Event>,
                  value: (string | MemberType)[]
                ) => {
                  const ids = value
                    .filter(
                      (item): item is MemberType => typeof item !== "string"
                    )
                    .map((item) => item.id);
                  setValue("memberIds", ids);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    if (typeof option === "string") {
                      return <span />;
                    }
                    return (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        className={clsx("m-3", option?.class)}
                        avatar={
                          <Tooltip title={option.name}>
                            <Avatar src={option.avatar} />
                          </Tooltip>
                        }
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select multiple Members"
                    label="Members"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </div>
          )}

          <div className="flex flex-row justify-between items-center ">
            <div className="flex items-center mt-16 mb-12">
              <FuseSvgIcon size={20}>heroicons-outline:paper-clip</FuseSvgIcon>
              <Typography className="font-semibold text-14 md:text-16 mx-8">
                Upload new attachments
              </Typography>
            </div>
            <input
              type="file"
              accept='.png, .jpg, .jpeg, .pdf, .doc, .docx'
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              multiple
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => fileInputRef.current.click()}
            >
              {fileUploadLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  <span className="mx-6 text-xs md:text-base">Uploading...</span>
                </>
              ) : (
                <>
                  <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                  <span className="mx-6 text-xs md:text-base">File Upload</span>
                </>
              )}

            </Button>
          </div>

          {cardForm.attachments && cardForm.attachments.length > 0 && (
            <Accordion className="rounded-xl !rounded-b-xl border border-gray-300 shadow-sm overflow-hidden" defaultExpanded >
              <AccordionSummary
                expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                aria-controls="graph-section-content"
                id="graph-section-header"
              >
                <FuseSvgIcon size={20}>heroicons-outline:document-duplicate</FuseSvgIcon>
                <Typography className="font-semibold text-16 mx-8">
                  All Attachments
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex flex-row  flex-wrap -mx-16">
                  {cardForm.attachments.map((item) => (
                    <CardAttachment
                      item={item}
                      card={cardForm}
                      makeCover={() => {
                        setValue("attachmentCoverId", item.id);
                      }}
                      removeCover={() => {
                        setValue("attachmentCoverId", "");
                      }}
                      removeAttachment={() => {
                        handleRemoveAttachment(item);
                      }}
                      key={item.id}
                    />
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          )}

          {cardForm.checklists && cardForm.checklists.length > 0 &&
            <Accordion className="mb-4 rounded-xl !rounded-b-xl border shadow-none border-gray-300 overflow-hidden">
              <AccordionSummary
                expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                aria-controls="graph-section-content"
                id="graph-section-header"
              >
                <FuseSvgIcon size={20}>heroicons-outline:check-circle</FuseSvgIcon>
                <Typography className="font-semibold text-16 mx-8">
                  CheckLists
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {
                  cardForm.checklists.map((checklist, index) => (
                    <CardChecklist
                      key={checklist.id}
                      checklist={checklist}
                      index={index}
                      onCheckListChange={(item, itemIndex) => {
                        setValue(
                          "checklists",
                          _.setIn(
                            cardForm.checklists,
                            `[${itemIndex}]`,
                            item
                          ) as ChecklistsType
                        );
                      }}
                      onRemoveCheckList={() => {
                        setValue(
                          "checklists",
                          _.reject(cardForm.checklists, { id: checklist.id })
                        );
                      }}
                    />
                  ))
                }
              </AccordionDetails>
            </Accordion>
          }
          <>
            <div className="flex items-center">
              <FuseSvgIcon size={20}>heroicons-outline:chat-alt</FuseSvgIcon>
              <Typography className="font-semibold text-16 mx-8">
                Comments
              </Typography>
            </div>
            <CardComment
              onCommentAdd={(comment) => {
                setValue("comments", [...cardForm.comments, comment])
                setValue("activities", [...cardForm.activities, ActivityModel({ description: `New comment added: ${comment.message}`, icon: 'heroicons-outline:chat-alt' })])
              }
              }
            />
            {
              cardForm.comments && cardForm.comments.length > 0 &&
              cardForm.comments.map((item) => (
                <List key={item.id}>
                  <CardActivity item={item} />
                </List>
              ))
            }
          </>

          <Accordion className="rounded-xl !rounded-b-xl border shadow-none border-gray-300 overflow-hidden" defaultExpanded={cardForm.activities.length > 0 ? true : false}>
            <AccordionSummary
              expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
              aria-controls="graph-section-content"
              id="graph-section-header"
            >
              <FuseSvgIcon size={20}>heroicons-outline:clipboard-list</FuseSvgIcon>
              <Typography className="font-semibold text-16 mx-8">
                Activity
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {
                cardForm.activities && cardForm.activities.length > 0 ? (
                  <Timeline
                    className="py-8"
                    position="right"
                    sx={{
                      '& .MuiTimelineItem-root:before': {
                        display: 'none'
                      }
                    }}
                  >
                    {cardForm.activities.map((item, index) => (
                      <ActivityTimelineItem
                        last={cardForm.activities.length === index + 1}
                        item={item}
                        key={item.id}
                      />
                    ))}
                  </Timeline>
                ) : (
                  <div className="flex flex-row items-center">
                    <FuseSvgIcon size={20}>heroicons-outline:eye-slash</FuseSvgIcon>
                    <Typography className="font-semibold text-16 mx-8">
                      No Activities yet
                    </Typography>
                  </div>
                )
              }
            </AccordionDetails>
          </Accordion>
        </Stack>
      </div>
      <div className="flex order-first sm:order-last items-start z-30 sticky top-10">
        <Box
          className="flex flex-row sm:flex-col items-center sm:py-8 rounded-12 w-full"
          sx={{ backgroundColor: "background.default" }}
        >
          <IconButton
            className="order-last sm:order-first"
            color="inherit"
            onClick={() => dispatch(closeCardDialog())}
            size="large"
          >
            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
          </IconButton>
          <div className="flex flex-row items-center sm:items-start sm:flex-col flex-1">
            {/* <Controller
							name="dueDate"
							control={control}
							render={({ field: { onChange, value } }) => (
								<DueMenu
									onDueChange={onChange}
									onRemoveDue={() => onChange(null)}
									dueDate={value}
								/>
							)}
						/> */}

            <Controller
              name="labels"
              control={control}
              defaultValue={[]}
              render={({ field: { onChange, value } }) => (
                <LabelsMenu
                  onToggleLabel={(labelId) => onChange(_.xor(value, [labelId]))}
                  labels={value}
                />
              )}
            />

            <Controller
              name="memberIds"
              control={control}
              defaultValue={[]}
              render={({ field: { onChange, value } }) => (
                <MembersMenu
                  onToggleMember={(memberId) =>
                    onChange(_.xor(value, [memberId]))
                  }
                  memberIds={value}
                />
              )}
            />

            {/* <Controller
              name="attachments"
              control={control}
              defaultValue={[]}
              render={() => (
                <IconButton size="large">
                  <FuseSvgIcon>heroicons-outline:paper-clip</FuseSvgIcon>
                </IconButton>
              )}
            /> */}

            <Controller
              name="checklists"
              control={control}
              defaultValue={[]}
              render={({ field: { onChange } }) => (
                <CheckListMenu
                  onAddCheckList={(newList) =>
                    onChange([...cardForm.checklists, newList])
                  }
                />
              )}
            />

            <OptionsMenu onRemoveCard={() => dispatch(removeCard())} />
          </div>
        </Box>
      </div>
    </DialogContent>
  );
}

export default BoardCardForm;
