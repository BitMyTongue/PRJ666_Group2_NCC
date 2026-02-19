const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref:"User",
        required: true,
        unique: true,
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
});

mongoose.models = {};
export const BookmarkModel = mongoose.model("bookmarks", bookmarkSchema);

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
