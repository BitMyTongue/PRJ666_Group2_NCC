const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  userId: {
      type: String,
      ref:"User",
      required: true,
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
    enum: ["POKEMON CARD", "BLIND BOX", "YUGIOH CARD", "FIGURINE"],
    required: true,
  },
  condition: {
    type: String,
    enum: ["USED", "NEW"],
    required: true,
  },
  images: {
    type: [String], //URL
    required: true,
  },
  meetUp: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    // ACTIVE: people can make offers on this listing
    // COMPLETE: the listing is closed
    // PENDING: an offer was accepted, you cannot make an offer on the listing
    enum: ["ACTIVE", "COMPLETE", "PENDING"],
    required: true,
  },
  location: {
    type: String,
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
