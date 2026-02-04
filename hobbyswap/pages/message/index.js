import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { JWTUserToken, StreamChat } from "stream-chat";
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

export default function MessagePage() {
  const { user } = useContext(UserContext);

  const router = useRouter();
  const { user: userQuery } = router.query;
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    const effectAsync = async () => {
      const userToken = localStorage.getItem("token");
      if (!userToken) {
        setLoading(false);
        return;
      }
      const tokenReq = await fetch("/api/auth/message-token", {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Cache-Control": "no-cache",
        },
      });
      if (tokenReq.ok && user) {
        const { token: chatToken } = await tokenReq.json();
        const client = StreamChat.getInstance(apiKey);
        console.log(user);
        client.connectUser(
          {
            id: user._id,
            name: user.username,
          },
          chatToken,
        );
        setClient(client);
        setLoading(false);
        setOptions({
          sort: { last_message_at: -1 },
          filters: {
            type: "messaging",
            members: { $in: [user._id] },
          },
          options: {
            limit: 10,
          },
        });
      } else setLoading(false);

      //   const client = useCreateChatClient({
      //     apiKey: apiKey,
      //     tokenOrProvider: process.env.NEXT_PUBLIC_TEST_TOKEN,
      //     userData: { id: curr },
      //   });
    };

    effectAsync();
  }, [user]);
  useEffect(() => {
    if (!client) return;
    if (!userQuery) return;

    client.channel("messaging", {
      members: [user._id, userQuery],
    });
  }, [client, userQuery]);

  return (
    <div id="root" className="sm-d-shadow">
      {loading ? (
        <Spinner />
      ) : client && options ? (
        <Chat client={client}>
          <ChannelList
            filters={options.filters}
            sort={options.sort}
            options={options.options}
          />
          <Channel>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      ) : (
        <div>Could not load chat interface.</div>
      )}
    </div>
  );
}
