import Knock from "@knocklabs/node";

export default async function handler(req, res) {
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
    const user = await userReq.json();
    console.log(user);
    const body = JSON.parse(req.body);
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
