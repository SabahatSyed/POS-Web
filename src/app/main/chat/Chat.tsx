"use client";
import { useAppSelector } from "app/store";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user/userSlice";
import { ChannelSort, StreamChat } from "stream-chat";
import "./style.css";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
  ChannelList,
  useChannelStateContext,
  TypingIndicator,
  ChannelHeaderProps,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";

export default function ChatMain() {
  const userData = useSelector(selectUser);
  console.log("u", userData);
  const apiKey = "gdd3bcjq9au3";
  const userId = userData.uuid;
  console.log("user", userId);
  const userName = userData.data.displayName;
  const user = {
    id: userId,
    name: userName,
    image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
  };
  // const selectUserData = (state) => state.user;

  console.log("user", user);
  const filters = { type: "messaging", members: { $in: [userData.uuid] } };
  const sort: ChannelSort = { last_message_at: -1 };
  const [client, setClient] = useState(null);
  const [addChannel, setAddChannel] = useState(false);
  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(user, chatClient.devToken(userData.uuid));

      const channel = chatClient.channel("messaging", "Logixsy", {
        image: "https://www.drupal.org/files/project-images/react.png",
        name: "Logixsy",
        members: [userData.uuid,'6554beb585231072c1944798'],
      });

      await channel.watch();
      setClient(chatClient);
    }
    init();
    if (client) return () => client.disconnectUser();
  }, []);
  if (!client) return <LoadingIndicator />;
  const CustomChannelHeader = (props: ChannelHeaderProps) => {
    const { title } = props;

    const { channel } = useChannelStateContext();
    const { name } = channel.data || {};

    return (
      <div className="str-chat__header-livestream">
        <div className="w-full">
          <div className="header-item w-full flex justify-between">
            <div>
              {" "}
              <span className="header-pound">#</span>
              {title || name}
            </div>
            {/*} <Button
					className="mx-8"
					variant="contained"
					color="secondary"
					component={NavLinkAdapter}
					to="new/edit"
				>
					<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
					<span className="mx-8">Add</span>
				</Button>
    */}
          </div>
          <TypingIndicator />
        </div>
      </div>
    );
  };
  return (
    <Chat client={client} theme="messaging light">
      <ChannelList filters={filters} />
      <Channel TypingIndicator={() => null}>
        <Window>
          <CustomChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}

/*import { ChannelFilters, ChannelOptions, ChannelSort, StreamChat, User } from 'stream-chat';
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';

import { useClient } from '../../hooks/useClient';

import 'stream-chat-react/dist/css/v2/index.css';

const userId = 'sabahat123';
const userName = 'Sabahat123';

const user: User = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
};

const apiKey = 'gdd3bcjq9au3';
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibGl0dGxlLXBpbmUtNCJ9.ixyCPVR1No4ZDAJTLGHh3u6QlD3iBbqTCcNR661CpdM';
const client = StreamChat.getInstance("dz5f4d5kzrue");

const sort: ChannelSort = { last_message_at: -1 };
const filters: ChannelFilters = {
  type: 'messaging',
  members: { $in: [userId] },
};
const options: ChannelOptions = {
  limit: 10,
};
console.log("filter,sort,options",filters,sort,options)
const App = () => {
  const chatClient = useClient({
    apiKey,
    user,
  });

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={chatClient} theme='str-chat__theme-light'>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default App;
*/
