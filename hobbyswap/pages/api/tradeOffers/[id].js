import { mongooseConnect } from "@/lib/dbUtils";
import { TradeOfferModel } from "@/lib/tradeOffer";
import { ListingModel } from "@/lib/listing";

/***********************************************************************************************************
 *                                              DA RULES
 * ---------------------------------------------------------------------------------------------------------
 * 
 * R1. Listing owner MUST be the one to ACCEPT or DECLINE an offer
 * R2. Listing owner cannot accept more than 1 offer at a time. (Listing status must be ACTIVE) 
 * R3. If offer is ACCEPTED, trade is ONGOING, listing is IN TRADE.
 * R4. If listing is NOT ACTIVE, an offer cannot be made (A trade is already ONGOING or COMPLETE)
 * R5. Only the Owner or Requester can CANCEL or COMPLETE a TRADE.
 * R6. If ONGOING TRADE is canceled, listing.status is set to ACTIVE (people can offer on the listing again) 
 * R7. If TRADE is COMPLETE, listing.status is also set to COMPLETE 
 * 
 **********************************************************************************************************/

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  try {
    await mongooseConnect();

    // GET trade offer by id
    if (method === "GET") {
      const tradeOffer = await TradeOfferModel.findById(id);

      if (!tradeOffer) {
        return res.status(404).json({ error: "Trade offer not found" });
      }

      return res.status(200).json({ tradeOffer });
    }

    // PATCH trade offer status updates (ACCEPT / DECLINE / CANCEL / COMPLETE)
    if (method === "PATCH") {
      const { action, actorId } = req.body;

      if (!action) return res.status(400).json({ error: "Missing action" });
      if (!actorId) return res.status(401).json({ error: "ActorId not found" });

      const tradeOffer = await TradeOfferModel.findById(id);
      if (!tradeOffer) return res.status(404).json({ error: "Trade offer not found" });

      const listing = await ListingModel.findById(tradeOffer.listingId);
      if (!listing) return res.status(404).json({ error: "Listing not found" });

      // REQUESTER: RETRACT
      if (action === "RETRACT") {
        // Retract OFFER (only requester, only before accepted)
        if (tradeOffer.offerStatus !== "PENDING") {
          return res.status(400).json({ error: "Offer cannot be retracted" });
        }

        tradeOffer.offerStatus = "RETRACTED";
      }

      // OWNER: ACCEPT
      if (action === "ACCEPT") {
        // R1
        if (actorId !== tradeOffer.ownerId) {
          return res.status(403).json({ error: "Only the owner can accept offers" });
        }

        // R2
        if (listing.status !== "ACTIVE") {
          return res.status(400).json({ error: "Listing is not available" });
        }

        // R3
        listing.status = "IN TRADE";
        await listing.save();
        tradeOffer.offerStatus = "ACCEPTED";
        tradeOffer.tradeStatus = "ONGOING";
        tradeOffer.respondedAt = new Date();
        await tradeOffer.save();

        return res.status(200).json({ message: "Offer Accepted", tradeOffer });
      }

      // OWNER: DECLINE
      if (action === "DECLINE") {
        // R1
        if (actorId !== tradeOffer.ownerId) {
          return res.status(403).json({ error: "Only the owner can decline offers" });
        }

        tradeOffer.offerStatus = "DECLINED";
        tradeOffer.respondedAt = new Date();
        await tradeOffer.save();

        return res.status(200).json({ message: "Offer Declined", tradeOffer });
      }

      // OWNER or REQUESTER: CANCEL
      if (action === "CANCEL") {

        // R5
        if (actorId !== tradeOffer.ownerId && actorId !== tradeOffer.requesterId) {
          return res.status(403).json({ error: "Not authorized to cancel this trade" });
        }

        // R6
        tradeOffer.tradeStatus = "CANCELED";
        tradeOffer.canceledAt = new Date();
        await tradeOffer.save();
        listing.status = "ACTIVE";
        await listing.save();

        return res.status(200).json({ message: "Trade Canceled", tradeOffer });
      }

      // OWNER or REQUESTER: COMPLETE
      if (action === "COMPLETE") {

        // R5
        if (actorId !== tradeOffer.ownerId && actorId !== tradeOffer.requesterId) {
          return res.status(403).json({ error: "Not authorized to complete this trade" });
        }

        // R7
        tradeOffer.tradeStatus = "COMPLETED";
        tradeOffer.completedAt = new Date();
        await tradeOffer.save();
        listing.status = "COMPLETE";
        await listing.save();

        return res.status(200).json({ message: "Trade Completed", tradeOffer });
      }

      return res.status(400).json({ error: "Invalid action" });
    }

    res.setHeader("Allow", ["GET", "PATCH"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error("TRADE OFFER BY ID API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
