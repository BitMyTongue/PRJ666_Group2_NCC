import jwt from "jsonwebtoken";
import { UserModel, mongooseConnect } from "@/lib/dbUtils";
import {Knock} from "@knocklabs/node";
console.log("DEBUG: Current Key is ->", process.env.KNOCK_API_KEY);

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const knockClient = new Knock({apiKey: process.env.KNOCK_API_KEY});

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store"); 
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await mongooseConnect();

    const user = await UserModel.findById(decoded.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ error: "User not found" });

    const hello=await knockClient.users.update(user._id,{
      name: user.username,
      email: user.email,
    })
    console.log("Knock User:", hello);

    res.status(200).json({ user });
  } catch (err) {
     console.error("ACTUAL ERROR CAUSING 401:", err); 
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
