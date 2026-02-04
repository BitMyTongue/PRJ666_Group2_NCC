import { JWTUserToken } from "stream-chat";

export default async function handler(req, res) {
  const userReq = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/auth/protect",
    {
      headers: req.headers,
      cache: "no-store",
    },
  );

  if (userReq.ok) {
    res.setHeader("Cache-Control", "no-store");
    const user = await userReq.json();
    console.log(user);
    const msgToken = JWTUserToken(
      process.env.STREAM_CHAT_SECRET,
      user.user._id,
    );
    return res.status(200).json({ token: msgToken });
  }
  return res.status(userReq.status).json(await userReq.json());
}
