import { faBorderStyle } from "@fortawesome/free-solid-svg-icons";
import Knock from "@knocklabs/node";
import { StreamChat } from "stream-chat";

export default async function handler(req, res) {
  const streamClient = new StreamChat(
    process.env.NEXT_PUBLIC_STREAM_CHAT_KEY,
    process.env.STREAM_CHAT_SECRET,
  );

  const knockClient = new Knock({ apiKey: process.env.KNOCK_API_KEY });
  const userReq = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/auth/protect",
    {
      headers: req.headers,
      cache: "no-store",
    },
  );

  if (userReq.ok) {
    res.setHeader("Cache-Control", "no-store");
    const body = JSON.parse(req.body);
    const unread = await streamClient.getUnreadCount(body.to);
    const channel = unread.channels.find((c) =>
      c.channel_id.endsWith(body.channel_id),
    );
    if (!channel || channel.unread_count == 0) {
      console.log("No channels unread");
      return res.status(204).end();
    }

    for await (const n of knockClient.messages.list({
      source: "new-message",
      engagement_status: ["unseen"],
    })) {
      if (
        n.recipient === body.to &&
        n.actors.length > 0 &&
        n.actors[0] == body.source
      ) {
        console.log("Notif already sent");
        return res.status(204).end();
      }
    }
    const result = await knockClient.workflows.trigger("new-message", {
      recipients: [body.to],
      actor: body.source,
      data: { message: body.message },
    });
    if (result) return res.status(200).json({ ...result });
    else return res.status(500).end();
  }
  return res.status(userReq.status).json(await userReq.json());
}
