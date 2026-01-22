import { UserModel, mongooseConnect } from "@/lib/dbUtils";
const bcrypt = require("bcryptjs");

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }

    //Check the duplicate username in the db
    const duplicate = await UserModel.findOne({ username: user }).exec();
    if (duplicate) {
        return res.status(409).json({ 'message': 'Username already exists' });
    }

    try {
        //Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await UserModel.create({
            "username": user,
            "password": hashedPwd
        });

        console.log(result);
        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };