const mongoose = require('mongoose');
import { mongooseConnect } from "@/lib/dbUtils";


const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref:"User",
        required: true,
    },
    listingId: {
        type: String,
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
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    dateBookmarked: {
        type: Date,
        default: Date.now,
    },
},
    { timestamps: true }
);

bookmarkSchema.index({ userId: 1, listingId: 1 }, { unique: true });
export const BookmarkModel =
  mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema, "bookmark");

export async function getBookmarksByUserId(userId) {
  await mongooseConnect();
  return BookmarkModel.find({ userId }).sort({ dateBookmarked: -1 }).exec();
}

// export async function mongooseConnect() {
//   if (mongoose.connections[0].readyState) {
//     return true;
//   }

//   try {
//     console.log(process.env.MONGODB_URI);
//     await mongoose.connect(process.env.MONGODB_URI);
//     return true;
//   } catch (err) {
//     throw new Error(err);
//   }
// }


