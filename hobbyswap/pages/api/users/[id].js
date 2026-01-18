import { UserModel, mongooseConnect } from "@/lib/dbUtils";

export default async function handler(req, res) {
  const { id } = req.query;
  const { firstName, lastName, username, email, password } = req.body;
  const { method } = req;

  try {
    await mongooseConnect();

    switch (method) {
      case "GET":
        const user = await UserModel.findById(id).exec();

        if (!user) {
          return res
            .status(404)
            .json({ message: `User with id: ${id} not found` });
        }

        res.status(200).json(user);
        break;

      case "PUT":
        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) updateData.password = password;

        await UserModel.updateOne({ _id: id }, { $set: updateData }).exec();
        res.status(200).json({ message: `User with id: ${id} updated` });
        break;
      case "DELETE":
        await UserModel.deleteOne({ _id: id }).exec();
        res.status(200).json({ message: `Deleted User with id: ${id}` });
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
