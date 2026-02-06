import { mongooseConnect } from "@/lib/dbUtils";
import { TradeOfferModel } from "@/lib/tradeOffer";
import { ListingModel } from "@/lib/listing";

export default async function handler(req, res) {
  const { method } = req;

  try {
    await mongooseConnect();
    switch (method) {
      case "GET":
        let tradeOffers = await TradeOfferModel.find().exec();
        res.status(200).json({ tradeOffers });
        break;

      case "POST": {
        const { requesterId, listingId, proposedMoney, proposedItems } = req.body;

        // validate required fields
        if (!requesterId) return res.status(401).json({ error: "RequesterId not found" });
        if (!listingId) return res.status(400).json({ error: "Missing ListingId" });

        // get listing, check it exists
        const listing = await ListingModel.findById(listingId).exec();
        if (!listing) return res.status(404).json({ error: "Listing not found" });
        
        // listing must be active
        if (listing.status !== "ACTIVE") {
          return res.status(400).json({ error: "This listing is not available for offers." });
        }

        // requester cannot offer on their own listing
        if (String(listing.userId) === String(requesterId)) {
          return res.status(400).json({ error: "You cannot make an offer on your own listing." });
        }

        // requester cannot have more than 1 active offer on a given listing
        // looks for an existing offer with the corresponding listing and requester id
        // & status PENDING/ACCEPTED
        const existingActive = await TradeOfferModel.findOne({
          listingId: String(listingId),
          requesterId: String(requesterId),
          offerStatus: { $in: ["PENDING", "ACCEPTED"] },
        }).exec();
        if (existingActive) {
          return res.status(409).json({ error: "You've already proposed an offer for this listing." });
        }

        // validate proposed items + money
        const itemArr = Array.isArray(proposedItems) ? proposedItems : [];
        const moneyNum = Number(proposedMoney) || 0;

        if (moneyNum < 0) {
          return res.status(400).json({ error: "Proposed money cannot be negative." });
        }

        // trade must offer item(s) and/or money
        if (!(itemArr.length > 0) && !(moneyNum > 0)) {
          return res.status(400).json({ error: "You must offer item(s) and/or money." });
        }

        // Create trade offer
        let newTradeOffer = new TradeOfferModel({
          requesterId,
          ownerId: listing.userId, // derive owner from listing
          listingId: String(listingId),
          proposedItems: itemArr,
          proposedMoney: moneyNum,
          offerStatus: "PENDING",
          tradeStatus: "NONE",
          createdAt: new Date(),
        });
        await newTradeOffer.save();
        res.status(201).json({ message: "Trade Offer Created", tradeOffer: newTradeOffer });
        break;
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error("TRADE OFFERS API ERROR:", err);
    return res.status(500).json({
      error: err.message,
    });
  }
}
