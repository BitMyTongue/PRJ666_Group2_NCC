import { UserModel, mongooseConnect } from "@/lib/dbUtils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StreamChat } from "stream-chat";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // ideally store in env
const JWT_EXPIRES_IN = "7d"; // 7 days

export default async function handler(req, res) {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email or username and password are required",
    });
  }

  try {
    await mongooseConnect();

    // login with email OR username
    const user = await UserModel.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email/username or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email/username or password",
      });
    }

    const userObj = user.toObject();
    delete userObj.password;

    const token = jwt.sign(
      { id: user._id, email: user.email }, // payload
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );
    const chatClient = new StreamChat(
      process.env.NEXT_PUBLIC_STREAM_CHAT_KEY,
      process.env.STREAM_CHAT_SECRET,
    );

    // creates a new user for messaging
    const updateResponse = await chatClient.upsertUsers([
      { id: user._id, role: "user" },
    ]);

    console.log(updateResponse);

    return res.status(200).json({
      message: "Login successful",
      user: userObj,
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
