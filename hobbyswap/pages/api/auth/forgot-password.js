import jwt from "jsonwebtoken";

const nodemailer = require("nodemailer");
const testAccount = await nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
  host: testAccount.smtp.host,
  port: testAccount.smtp.port,
  secure: testAccount.smtp.secure,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

// Output: https://ethereal.email/message/...
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const userReq = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/users", {
    method: "GET",
    cache: "no-store",
  });
  if (!userReq.ok) return res.status(500).end();
  const { users } = await userReq.json();
  switch (req.method) {
    case "POST": {
      const { email } = JSON.parse(req.body);
      if (email) {
        res.setHeader("Cache-Control", "no-store");
        const user = users.find((u) => u.email == email);

        if (!user) return res.status(404).end();

        const token = jwt.sign(email, process.env.JWT_SECRET);
        // expires after 15 minutes
        res.setHeader(
          "Set-Cookie",
          `fPW=${token}; Max-Age=${15 * 60};Path="/"; SameSite=Strict; HttpOnly`,
        );
        const info = await transporter.sendMail({
          from: '"Test Sender" <test@example.com>',
          to: email,
          subject: "Forgot Password",
          text: "Click here to reset your password",
          html: `<a href='${process.env.NEXT_PUBLIC_API_URL}/forgot?token=${token}'>Click here to reset your password</a>`,
        });

        console.log("Message sent: %s", info.messageId);

        // Get the Ethereal URL to preview this email
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log("Preview URL: %s", previewUrl);

        return res.status(200).end();
      }
      return res.status(400).end();
    }
    case "GET": {
      const { callback } = req.query;
      const cookie = req.headers["cookie"];
      console.log(req.headers);
      if (cookie && cookie.includes("fPW=")) {
        const values = cookie.split(";");
        const emailToken = values[0].split("=")[1];
        if (emailToken !== callback) return res.status(400).end();
        const email = jwt.verify(emailToken, process.env.JWT_SECRET);
        if (email) {
          const user = users.find((u) => u.email == email);
          if (user) return res.status(204).end();
        }
        return res.status(400).end();
      }
    }
  }

  return res.status(400).end();
}
