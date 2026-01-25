import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: true,
    },
    lastName:{ 
      type: String, 
      required: true,
    },
    username:{ 
      type: String, 
      required: true, 
      unique: true, 
    },
    email: {
      type: String, 
      required: true, 
      unique: true, 
    },
    password: {
     type: String, 
     required: true, 
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const UserModel =
  mongoose.models.users || mongoose.model("users", userSchema);

export async function mongooseConnect() {
  if (mongoose.connections[0].readyState) {
    return true;
  }

  try {
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    return true;
  } catch (err) {
    throw new Error(err);
  }
}
