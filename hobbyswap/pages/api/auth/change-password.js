import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { callback, password } = req.body;
  let email = "";

  const cookie = req.headers["cookie"];
  if (cookie && cookie.includes("fPW=")) {
    const values = cookie.split(";");
    const emailToken = values.find((v) => v.startsWith("fPW="))?.split("=")[1];
    if (emailToken !== callback) return res.status(400).end();
    email = jwt.verify(emailToken, process.env.JWT_SECRET);
  }
  const userReq = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/users", {
    method: "GET",
    cache: "no-store",
  });

  if (userReq.ok) {
    res.setHeader("Cache-Control", "no-store");
    const { users } = await userReq.json();
    const user = users.find((u) => u.email == email);

    if (user) {
      const putUser = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/users/" + user._id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt.sign(user._id, process.env.JWT_SECRET)}`,
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({ password: password }),
        },
      );

      if (putUser.ok) {
        s;
        res.setHeader(
          "Set-Cookie",
          `fPW=${callback}; Max-Age=0;Path="/"; SameSite=Strict; HttpOnly`,
        );
        return res.status(200).json(await putUser.json());
      }
    }

    return res.status(500).end();
  }
  return res.status(userReq.status).json(await userReq.json());
}
