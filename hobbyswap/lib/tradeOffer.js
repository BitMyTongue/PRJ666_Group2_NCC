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
    // PENDING: offer created, listing.owner hasn't responded
    // ACCEPTED: listing.owner accepted this offer, listing is put on IN TRADE, trade is put on ONGOING
    // DECLINED: listing.owner declined this offer
    // RETRACTED: REQUESTER has retracted this offer
    enum: ["PENDING", "ACCEPTED", "DECLINED", "RETRACTED"],
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
    default: "NONE",    // tradeStatus only changes to ONGOING when listing.owner ACCEPTS an OFFER
  },

  proposedItems: {
    type: [String],     // selected items from a dropdown, taken from listing.requestItems
    default: [],
  },
  proposedMoney: {
    type: Number,   
    default: 0,
  },
  meetUp: {
    type: Boolean,
    default: false,
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
