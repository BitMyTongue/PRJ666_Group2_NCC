import { UserContext } from "@/contexts/UserContext";
import {
  faArrowLeft,
  faCircle,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React from "react";
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
} from "stream-chat-react";
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
        const cli = StreamChat.getInstance(apiKey);
        await cli.connectUser(
          {
            id: user._id,
            name: user.username,
          },
          chatToken,
        );

        const notifMiddleware = (composer) => ({
          id: "message-composer/message-composer/relay-notification",
          handlers: {
            compose: async ({ state, next, forward }) => {
              if (!composer.textComposer) return forward();
              const { text } = composer.textComposer;

              const msg = state.localMessage;
              const other = composer.channel.data.created_by;

              const online = await cli.queryUsers({ id: other.id });
              console.log(online.users);
              if (!other) return forward();
              const data = msg.attachments.length > 0 ? "🖼️" : text;

              // Fie and forget
              fetch("/api/auth/message-notif", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${userToken}`,
                  "Cache-Control": "no-cache",
                },
                body: JSON.stringify({
                  to: other.id,
                  source: user._id,
                  message: data,
                  channel_id: composer.channel.data.id,
                  chat_token: chatToken,
                }),
              });

              return next({ ...state });
            },
          },
        });
        if (!client) {
          cli.setMessageComposerSetupFunction(({ composer }) => {
            console.log("setting");
            composer.compositionMiddlewareExecutor.insert({
              middleware: [notifMiddleware(composer)],
              position: {
                after: "stream-io/message-composer-middleware/data-cleanup",
              },
            });
          });
        }

        setClient(cli);
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
      const result = await channel.watch({ presence: true });
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
              if (e.user_id === user._id) {
                return;
              }

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
