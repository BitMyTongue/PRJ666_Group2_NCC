import { UserModel, mongooseConnect } from "@/lib/dbUtils";

export default async function handler(req, res) {
  const { firstName, lastName, username, email, password } = req.body;
  const { method } = req;

  try {
    await mongooseConnect();

    switch (method) {
      case "GET":
        let users = await UserModel.find().exec();
        res.status(200).json({ users });
        break;
      case "POST":
        // Check if user already exists in db
        const existingUser = await UserModel.findOne({ $or: [{email}, {username}]});
        if (existingUser){
          return res.status(409).json({ error: "Email or username already exists"});
        }

        let newUser = new UserModel({ firstName, lastName, username, email, password });
        await newUser.save();
        res.status(201).json({ message: "User Created", user: newUser });
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
