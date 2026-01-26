import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { JWTUserToken } from "stream-chat";
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

//TODO: build on this

const apiKey = process.env.NEXT_PUBLIC_STREAM_CHAT_KEY;

const curr = "test";

// export const getServerSideProps = async ({ id }) => {
//   const apiSecret = process.env.STREAM_CHAT_SECRET;
//   const token = JWTUserToken(apiSecret, id);
//   const curr = await fetch("/users/id");
//   return { props: { token: token, user: curr, target:  } };
// };

export default function MessagePage(props) {
  const router = useRouter();
  //const { id } = router.query;
  const client = useCreateChatClient({
    apiKey: apiKey,
    tokenOrProvider: process.env.NEXT_PUBLIC_TEST_TOKEN,
    userData: { id: curr },
  });
  const [channel, setChannel] = useState(null);
  const sort = { last_message_at: -1 };
  const filters = {
    type: "messaging",
    members: { $in: [curr] },
  };
  const options = {
    limit: 10,
  };
  //   useEffect(() => {
  //     if (!client) return;
  //     if (!id) return;

  //     const channel = client.channel("messaging", {
  //       members: [id, props.user.username],
  //     });

  //     setChannel(channel);
  //   }, [client]);

  return (
    <div id="root" className="sm-d-shadow">
      {!client ? (
        <Spinner />
      ) : (
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
      )}
    </div>
  );
}
