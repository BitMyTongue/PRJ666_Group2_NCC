const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  userId: {
      type: String,
      ref:"User",
      required: true,
      unique: true,
  },
  title:{
    type: String,
    required: true,
  },
  description:{
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
  status: {
    type: Boolean,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
});

mongoose.models = {};
export const ListingModel = mongoose.model("listings", listingSchema);

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
