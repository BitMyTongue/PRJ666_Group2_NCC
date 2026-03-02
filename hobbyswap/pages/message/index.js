import { UserContext } from "@/contexts/UserContext";
import {
  faArrowLeft,
  faCircle,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { StreamChat } from "stream-chat";
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  Window,
  Thread,
  Avatar,
  ChannelPreviewMessenger,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";

//TODO: build on this

const apiKey = process.env.NEXT_PUBLIC_STREAM_CHAT_KEY;
const actions = ["delete", "mute", "pin", "quote"];
const customActions = {
  Report: (msg) => {
    //TODO: report stuff
  },
};

// export const getServerSideProps = async ({ id }) => {
//   const apiSecret = process.env.STREAM_CHAT_SECRET;
//   const token = JWTUserToken(apiSecret, id);
//   const curr = await fetch("/users/id");
//   return { props: { token: token, user: curr, target:  } };
// };

const CustomChannelList = ({ children }) => {
  return (
    <div className="w-100">
      <div className="bg-white p-1 w-100 position-sticky str-chat__channel-list-toggle">
        <FontAwesomeIcon
          role="button"
          className="m-3"
          icon={faArrowLeft}
          size="lg"
          onClick={() => {
            const list = document.getElementsByClassName(
              "str-chat__channel-list",
            );
            if (list.length > 0) {
              if (list[0].classList.contains("--open")) {
                list[0].classList.remove("--open");
              }
            }
          }}
        />
      </div>

      {children}
    </div>
  );
};

const CustomChannelHeader = (props) => {
  let id = null;
  const { title } = props;

  const { members } = useChannelStateContext();

  if (members[props.id]) id = Object.keys(members).find((v) => v !== props.id);

  return (
    id && (
      <div className="str-chat__channel-header">
        <div
          className="position-relative p-1 str-chat__header-hamburger"
          onClick={() => {
            const list = document.getElementsByClassName(
              "str-chat__channel-list",
            );
            if (list.length > 0) {
              if (list[0].classList.contains("--open")) {
                list[0].classList.remove("--open");
              } else {
                list[0].classList.add("--open");
              }
            }
          }}
        >
          <FontAwesomeIcon
            className=""
            role="button"
            icon={faListUl}
            size="ms"
          />
          {props.hasUnread && (
            <FontAwesomeIcon
              className="position-absolute"
              style={{
                top: 0,
                right: 0,
              }}
              icon={faCircle}
              color="red"
              size="sm"
            />
          )}
        </div>

        <div
          className="d-flex gap-2 align-items-center"
          role="button"
          onClick={() => {
            router.push("/users/" + id);
          }}
        >
          <Avatar name={title ?? members[id].user.name} />
          <div>{title || members[id].user.name}</div>
        </div>
      </div>
    )
  );
};

export default function MessagePage() {
  const { user } = useContext(UserContext);

  const router = useRouter();
  const { user: userQuery } = router.query;
  const [hasUnread, setHasUnread] = useState(false);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [options, setOptions] = useState(null);
  const [activeCh, setActiveCh] = useState("");

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
    };

    effectAsync();
  }, [user]);
  useEffect(() => {
    const effectAsync = async () => {
      if (!client) return;
      if (!userQuery || user._id === userQuery) return;
      const channel = client.channel("messaging", {
        members: [user._id, userQuery],
      });

      const result = await channel.watch();
      setActiveCh(result.channel.id);
    };
    effectAsync();
  }, [user, client, userQuery]);

  return (
    <div id="root" className="sm-d-shadow">
      {loading ? (
        <Spinner />
      ) : client &&
        options &&
        (!userQuery || user._id === userQuery || activeCh) ? (
        <Chat client={client} initialNavOpen={false}>
          <ChannelList
            List={CustomChannelList}
            filters={options.filters}
            sort={options.sort}
            options={options.options}
            customActiveChannel={activeCh}
            onMessageNewHandler={(s, e) => {
              if (e.user_id === user._id) return;
              if (e.channel_id === activeCh) return;
              setHasUnread(e.unread_count > 0);
              s((channels) => {
                const c = channels.splice(
                  channels.findIndex((v) => v.cid === e.cid),
                  1,
                );
                return [...c, ...channels];
              });
            }}
            Preview={(props) => (
              <ChannelPreviewMessenger
                {...props}
                onSelect={async () => {
                  const result = await client.queryChannels({
                    type: "messaging",
                    members: { $in: [user._id] },
                    hasUnread: true,
                  });
                  setHasUnread(result.length > 0);
                  const list = document.getElementsByClassName(
                    "str-chat__channel-list",
                  );
                  if (list.length > 0) {
                    if (list[0].classList.contains("--open")) {
                      list[0].classList.remove("--open");
                    }
                  }
                  setActiveCh(props.channel.id);
                  props.setActiveChannel(props.channel);
                }}
              />
            )}
          />
          <Channel>
            <Window>
              <CustomChannelHeader id={user._id} hasUnread={hasUnread} />
              <MessageList
                messageActions={actions}
                customMessageActions={customActions}
                onUserClick={(_, user) => {
                  router.push("/users/" + user.id);
                }}
              />
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
