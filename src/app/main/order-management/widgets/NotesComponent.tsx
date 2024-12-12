import React, { SetStateAction, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import format from "date-fns/format";
import { useAppDispatch, useAppSelector } from "app/store";
import { selectUser } from "app/store/user/userSlice";
import "./styles.css";
import { showMessage } from "app/store/fuse/messageSlice";

interface NotesComponentProps {
  id: string;
  data?: string[];
  setNoteData?:SetStateAction<any>;
}

const NotesComponent: React.FC<NotesComponentProps> = ({ id,data=[],setNoteData=()=>{} }) => {
  const dispatch = useAppDispatch();
  const [noteText, setNoteText] = useState("");
  // const [data, setNoteData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState("");
  const user = useAppSelector(selectUser);
  const userId= user.data?.id;
  const notesContainerRef = useRef<HTMLDivElement>(null); // Create a ref

  const handleChange = (e: any) => {
    if(e.target.value !='\n'){
      setNoteText(e.target.value);
    }
  };
const textareaRef = useRef(null);

useEffect(() => {
  if (editNoteId && textareaRef.current) {
    adjustTextareaHeight();
  }
}, [editNoteText, editNoteId]);

const adjustTextareaHeight = () => {
  const textarea = textareaRef.current;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
};
  const getData = async () => {
    await axios
      .get(`api/order_list/fetch_order_notes?order_list_id=${id}`)
      .then((res) => {
        setNoteData(res.data.notes);
      });
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios
        .post("api/order_list/add_note", { note: noteText, order_list_id: id })
        .then(() => {
          setLoading(false);
          getData();
          setNoteText("");
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
    if (e.key === "Enter" && noteText.length > 0) {
        handleSubmit();
    }
  }
  };

  // Scroll to the bottom whenever the data changes
  useEffect(() => {
    if (notesContainerRef.current) {
      notesContainerRef.current.scrollTop =
        notesContainerRef.current.scrollHeight;
    }
  }, [data]);

  const handleEdit = (noteId: string, noteText: string) => {
    setEditNoteId(noteId);
    setEditNoteText(noteText);
  };

  const handleSaveEdit = async (noteId: string) => {
    setEditLoading(true);
    try {
      await axios.put("api/order_list/edit_note", {
        id: noteId,
        note: editNoteText,
        order_list_id: id,
      });
      setEditNoteId(null);
      getData();
      dispatch(showMessage({ variant: "success", message: "Note Edited" }));
    } catch (error) {
      console.log(error);
      dispatch(showMessage({ message: "Error", variant: "error" }));
    }
    setEditLoading(false);
  };

    const handleCancelEdit = () => {
      setEditNoteId(null);
      setEditNoteText("");
    };
  const handleDelete = async (id: string, note: string, listId: string) => {
    setDeleteLoading(true);
    try {
      await axios.delete(
        `/api/order_list/delete_note?id=${id}&note=${note}&order_list_id=${listId}`
      );
      dispatch(showMessage({ variant: "success", message: "Note Deleted" }));
      getData();
    } catch (error) {
      dispatch(showMessage({ message: "Error", variant: "error" }));
    }
    setDeleteLoading(false);
  };

  return (
    <>
      <div
        ref={notesContainerRef}
        className="xlg:h-[75%] md:h-[70%] overflow-y-auto"
      >
        {data.length > 0 ? (
          data.map((noteData, index) => (
            <div
              key={index}
              id={`note_${index}`}
              className="noteContainer flex w-full gap-10 pb-10 pt-3"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar alt={noteData.user} src=".." />
                <div className="h-full">
                  <Divider
                    className="h-full w-[2px] bg-[#757575] text-center mt-4"
                    orientation="vertical"
                    flexItem
                  />
                </div>
              </div>
              <div className="flex w-full justify-between">
                <div className="w-[88%] flex flex-col">
                  <Typography className="text-[#525252] font-600 text-[12px] xlg:text-[14px]">
                    {noteData.user}
                  </Typography>
                  {editNoteId === noteData.id ? (
                    <div className=" bg-white">
                      <textarea
                        ref={textareaRef}
                        value={editNoteText}
                        onChange={(e) => setEditNoteText(e.target.value)}
                        className="mt-4 w-full pl-5"
                        rows={1}
                      />
                      <div className="flex justify-end gap-10 py-10 pr-10">
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          endIcon={
                            editLoading && (
                              <CircularProgress
                                size={16}
                                className="text-[#C5C8CA]"
                              />
                            )
                          }
                          onClick={() => handleSaveEdit(noteData.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          className="bg-[#F5F5F5] hover:bg-[#F5F5F5]"
                          size="small"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Typography className="font-400 text-[10px] xlg:text-[12px] p-5 mt-4 border-1">
                      {noteData.note}
                    </Typography>
                  )}
                </div>
                <div className="font-300 lg:w-[12%] sm:w-[15%] sm:text-[10px] md:text-[10px] lg:text-[10px] xlg:text-[12px]">
                  {format(new Date(noteData.date_added * 1000), "hh:mm a")}
                </div>
              </div>
              {userId === noteData.user_id && editNoteId != noteData.id && (
                <div className="iconContainer">
                  {
                    <>
                      <EditIcon
                        style={{ fontSize: "16px" }}
                        className="icon"
                        onClick={() => handleEdit(noteData.id, noteData.note)}
                      />
                      {deleteLoading ? (
                        <div className="ml-6 inline-flex items-center">
                          <CircularProgress
                            size={16}
                            className="text-[#C5C8CA]"
                          />
                        </div>
                      ) : (
                        <DeleteIcon
                          style={{ fontSize: "16px" }}
                          className="icon"
                          onClick={() =>
                            handleDelete(
                              noteData.id,
                              noteData.note,
                              noteData.order_list_id
                            )
                          }
                        />
                      )}
                    </>
                  }
                </div>
              )}
            </div>
          ))
        ) : (
          <>You can add notes here</>
        )}
      </div>
      <div className="flex items-center gap-10 absolute bottom-0 w-[95%]  bg-[#f5f5f5]">
        <Avatar alt={user?.data?.displayName} src=".." />
        <InputBase
          value={noteText}
          multiline
          minRows={1}
          maxRows={2}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          type={"text"}
          className="rounded-3xl pl-10 border-2 w-full py-[10px] border-secondary"
          placeholder="Add a note"
        />
        {loading ? (
          <div className="ml-6 inline-flex items-center">
            <CircularProgress size={16} color="inherit" />
          </div>
        ) : (
          <IconButton disabled={noteText.length === 0} onClick={handleSubmit}>
            <SendIcon fontSize="large" className="text-secondary" />
          </IconButton>
        )}
      </div>
    </>
  );
};

export default NotesComponent;
