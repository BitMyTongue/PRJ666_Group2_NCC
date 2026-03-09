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
    address: {
      type: String,
      default: null,
    },
    site: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Not Specified"],
      default: "Not Specified",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    reviews: {
      type: [{
        reviewerId: {
          type: String,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        tradeOfferId: {
          type: String,
          ref: "tradeOffers",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

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
