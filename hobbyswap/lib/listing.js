const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  userId: {
      type: String,
      required: true,
      //// Users should be able to create multiple listings
      // unique: true,
  },
  itemName:{
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
    //// Probably removing this field entirely
    // required: true,
  },
  condition: {
    type: String,
    enum: ["USED", "NEW"],
    required: true,
  },
  images: {
    type: [String],
    //// Commenting out required to allow posting without images for now
    // required: true,
  },
  meetUp: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    // Changed type of status from Boolean to String
    type: String,
    enum: ["ACTIVE", "COMPLETE", "PENDING"],
    required: true,
  },
  location: {
    type: String,
    //// Should only be required if is meetup selected
    // required: true,
  },
  requestItems: {
    // Requested items stored as a string array ( [Charizard, Pikachu... ] )
    type: [String],
    default: [],
  },
  requestMoney: {
    type: Number,
    default: 0,
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
