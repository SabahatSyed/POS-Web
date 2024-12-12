/**
 * PreviousStatementWidgetType
 */
export type MessagePayloadType = {
	title: string;
	message: string;
};

export type MessageType = {
	id: string;
	user_id: string;
    message_id: string;
    receiver_id: string;
    sender_id: string;
    message: string;
    reply: string;
    title:string;
    read_by_sender: boolean;
    read_by_receiver: boolean;
    comments: CommentType[];
    date_added: number;
    date:string;
    sender:string;

	
}

export type CommentType ={
    message: string;
    date: string;
    added_by:string;
}
// export type ReplyPayload = {
//     reply: string;
//     read_by_receiver: boolean;
//     id: string;
// }

export type ReplyPayload = {
    message: string;
    support_id: string;
}