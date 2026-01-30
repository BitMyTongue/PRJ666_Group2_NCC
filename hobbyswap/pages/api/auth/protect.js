// pages/api/me.js
import jwt from "jsonwebtoken";
import { UserModel, mongooseConnect } from "@/lib/dbUtils";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store"); 
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await mongooseConnect();

    const user = await UserModel.findById(decoded.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
