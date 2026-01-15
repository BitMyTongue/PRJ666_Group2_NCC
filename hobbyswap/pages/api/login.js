import { UserModel, mongooseConnect } from "@/lib/dbUtils";

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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
