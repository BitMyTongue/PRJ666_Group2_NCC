import { UserModel, mongooseConnect } from "@/lib/dbUtils";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
require("dotenv").config();

export default async function handler(req, res) {
  const { email, password } = req.body;
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    await mongooseConnect();

    // Find user by email or username
    const user = await UserModel.findOne({
      $or: [{ email }, { username: email }],
    }).exec();

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords (in production, use bcrypt)
    // For now, doing basic comparison
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return user data (exclude password)
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ user: userWithoutPassword });

    // Using bcrypt for password comparison
    const bcryptMatch = await bcrypt.compare(password, user.password);
    if (!bcryptMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    //Implementation of JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d"
      }
    );
    res.json({ token });

    // Exclude password from response
    const { password: __, ...userData } = user.toObject();

    return res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
