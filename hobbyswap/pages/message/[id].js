import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  useCreateChatClient,
  Window,
  Thread,
} from "stream-chat-react";
const apiKey = process.env.NEXT_PUBLIC_STREAM_CHAT_KEY;
const id = "test";
const token = "";

export default function MessagePage() {
  const [channel, setChannel] = useState();
  const router = useRouter();
  const client = useCreateChatClient({
    apiKey: apiKey,
    tokenOrProvider: token,
    userData: { id: id },
  });

  const sort = { last_message_at: -1 };
  const filters = {
    type: "messaging",
    members: { $in: [id] },
  };
  const options = {
    limit: 10,
  };
  //   useEffect(() => {
  //     if (!client) return;

  //     const channel = client.channel("messaging", {
  //       members: [id, "seagull"],
  //     });

  //     setChannel(channel);
  //   }, [client]);

  if (!client) return <div>Setting up client & connection...</div>;

  return (
    <div id="root">
      <Chat client={client}>
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
    </div>
  );
}
