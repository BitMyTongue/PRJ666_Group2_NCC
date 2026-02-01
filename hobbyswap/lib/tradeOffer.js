const mongoose = require("mongoose");

const tradeOfferSchema = new mongoose.Schema({
  requesterId: {
    type: String,
    ref: "User",
    required: true,
  },
  ownerId: {
    type: String,
    ref: "User",
    required: true,
  },
  listingId: {
    type: String,
    ref: "listings",
    required: true,
  },

  offerStatus: {
    type: String,
    // PENDING: offer created, owner hasn't responded
    // ACCEPTED: owner accepted this offer, listing is put on PENDING, trade is put on ONGOING
    // DECLINED: owner declined this offer
    enum: ["PENDING", "ACCEPTED", "DECLINED"],
    required: true,
    default: "PENDING",
  },

  tradeStatus: {
    type: String,
    // NONE: offer has not been accepted (no trade yet)
    // ONGOING: offer accepted, trade is in progress
    // COMPLETED: trade finished, listing.status is put on COMPLETE
    // CANCELED: trade did not go through, listing.status is put on ACTIVE
    enum: ["NONE", "ONGOING", "COMPLETED", "CANCELED"],
    required: true,
    default: "NONE",    // tradeStatus only changes 
  },

  proposedItems: {
    type: [String],     // selected items from a dropdown, taken from listing.requestItems
    default: [],
  },
  proposedMoney: {
    type: Number,   
    default: 0,
  },

  // DATES
  createdAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,         // accepted or declined date
  },
  completedAt: {
    type: Date,
  },
  canceledAt: {
    type: Date,
  },
});

// one offer per person on any given listing
tradeOfferSchema.index({ listingId: 1, requesterId: 1 }, { unique: true });

mongoose.models = {};
export const TradeOfferModel = mongoose.model("tradeOffers", tradeOfferSchema);

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
