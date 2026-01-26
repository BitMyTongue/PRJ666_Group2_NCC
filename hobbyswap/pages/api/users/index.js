import { UserModel, mongooseConnect } from "@/lib/dbUtils";

export default async function handler(req, res) {
  const { firstName, lastName, username, email, password } = req.body;
  const { method } = req;

  try {
    await mongooseConnect();

    switch (method) {
      case "GET":
      const users = await UserModel.find().select("-password");
      return res.status(200).json({ users });
      break;
      case "POST":
        // Check if user already exists in db
         if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const existingUser = await UserModel.findOne({ $or: [{email}, {username}]});
      if (existingUser){
          return res.status(409).json({ error: "Email or username already exists"});
      }

      const user = await UserModel.create({
        firstName,
        lastName,
        username,
        email,
        password,
      });
      const userObj = user.toObject();
      delete userObj.password;
        res.status(201).json({ message: "User Created", user: user });
    break;
    default:
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
  } catch (err) {
    console.error("API USERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
