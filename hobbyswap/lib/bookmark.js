const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
      type: String,
      ref:"User",
      required: true,
  },
   listingId: {
      type: String,
      ref:"listings",
      required: true,
  },
  savedAt: {
    type: Date, 
    default: Date.now,
  },
});

// Compound unique index: prevent same user from bookmarking same listing twice
bookmarkSchema.index({ userId: 1, listingId: 1 }, { unique: true });

mongoose.models = {};
export const BookmarkModel = mongoose.model("bm", bookmarkSchema);

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
