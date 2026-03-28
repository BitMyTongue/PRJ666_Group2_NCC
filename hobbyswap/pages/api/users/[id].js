import { UserModel, mongooseConnect } from "@/lib/dbUtils";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { id } = req.query;
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    address,
    site,
    gender,
    dateOfBirth,
    profilePicture,
  } = req.body;
  const { method } = req;

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  try {
    await mongooseConnect();

    if (method == "PUT" || method == "DELETE") {
      const auth = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/auth/protect",
        {
          headers: req.headers,
          cache: "no-store",
        },
      );
      if (!auth.ok) return res.status(auth.status).json(auth.statusText);
      const authUser = await auth.json();
      if (id !== authUser.user._id) return res.status(403).end();
    }

    switch (method) {
      case "GET":
        const user = await UserModel.findById(id).exec();

        if (!user) {
          return res
            .status(404)
            .json({ message: `User with id: ${id} not found` });
        }

        return res.status(200).json(user);

      case "PUT":
        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (address !== undefined) updateData.address = address;
        if (site !== undefined) updateData.site = site;
        if (gender) updateData.gender = gender;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
        if (profilePicture !== undefined)
          updateData.profilePicture = profilePicture;
        await UserModel.updateOne({ _id: id }, { $set: updateData }).exec();
        // return updated user so client can refresh state
        const updatedUser = await UserModel.findById(id).select("-password");
        return res
          .status(200)
          .json({ message: `User with id: ${id} updated`, user: updatedUser });

      case "DELETE":
        await UserModel.deleteOne({ _id: id }).exec();
        return res.status(200).json({ message: `Deleted User with id: ${id}` });

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
