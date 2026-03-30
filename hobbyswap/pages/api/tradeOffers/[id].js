import { mongooseConnect } from "@/lib/dbUtils";
import { TradeOfferModel } from "@/lib/tradeOffer";
import { ListingModel } from "@/lib/listing";
import { Knock } from "@knocklabs/node";

const knockClient = new Knock({ apiKey: process.env.KNOCK_API_KEY });

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
 * R8. TRADES can only be CANCELED within a 2 HOUR period from the time the trade was accepted.
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
        tradeOffer.respondedAt = new Date();
        await tradeOffer.save();

        try {
          await knockClient.workflows.trigger("new-activity", {
            data: {
              tradeAction: "offer_retracted",
              listingName: String(listing.itemName),
              offerStatus: tradeOffer.offerStatus,
              tradeStatus: tradeOffer.tradeStatus,
              action_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tradeOffers?listingId=${tradeOffer.listingId}`
            },
            recipients: [listing.userId.toString()],
            actor: actorId.toString(),
          });
          console.log("Knock Workflow Triggered for Offer Retracted");
        } catch (knockErr) {
          console.error("Knock Trigger Error:", knockErr.message);
        }

        return res.status(200).json({ message: "Offer Retracted", tradeOffer });
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
        
        try {
          await knockClient.workflows.trigger("new-activity", {
            data: {
              tradeAction: "offer_accepted",
              listingName: String(listing.itemName),
              offerStatus: tradeOffer.offerStatus,
              tradeStatus: tradeOffer.tradeStatus,
              action_url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/${tradeOffer.requesterId}/offers`
            },
            recipients: [tradeOffer.requesterId.toString()],
            actor: actorId.toString(),
          });
          console.log("Knock Workflow Triggered for Offer Accepted");
        } catch (knockErr) {
          console.error("Knock Trigger Error:", knockErr.message);
        }

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

        try {
          await knockClient.workflows.trigger("new-activity", {
            data: {
              tradeAction: "offer_declined",
              listingName: String(listing.itemName),
              offerStatus: tradeOffer.offerStatus,
              tradeStatus: tradeOffer.tradeStatus,
              action_url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/${tradeOffer.requesterId}/offers`
            },
            recipients: [tradeOffer.requesterId.toString()],
            actor: actorId.toString(),
          });
          console.log("Knock Workflow Triggered for Offer Declined");
        } catch (knockErr) {
          console.error("Knock Trigger Error:", knockErr.message);
        }
        
        return res.status(200).json({ message: "Offer Declined", tradeOffer });
      }

      // OWNER or REQUESTER: CANCEL
      if (action === "CANCEL") {

        // R5
        if (actorId !== tradeOffer.ownerId && actorId !== tradeOffer.requesterId) {
          return res.status(403).json({ error: "Not authorized to cancel this trade" });
        }

        if (tradeOffer.tradeStatus !== "ONGOING") {
          return res.status(400).json({ error: "Trade is not active" });
        }
        
        // R8
        const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

        if (!tradeOffer.respondedAt) {
          return res.status(400).json({ error: "Owner has not responded to this offer" });
        }

        const acceptedTime = new Date(tradeOffer.respondedAt).getTime();
        const now = Date.now();
        
        if (now - acceptedTime > TWO_HOURS_MS) {
          return res.status(403).json({ error: "Cancel window has expired (2 hours)" });
        }

        // R6
        tradeOffer.tradeStatus = "CANCELED";
        tradeOffer.offerStatus = "CANCELED";
        tradeOffer.canceledAt = new Date();
        await tradeOffer.save();
        listing.status = "ACTIVE";
        await listing.save();

      try {
        await knockClient.workflows.trigger("new-activity", {
          data: {
            tradeAction: "trade_canceled",
            listingName: listing.itemName,
            offerStatus: tradeOffer.offerStatus,
            tradeStatus: tradeOffer.tradeStatus,
            action_url: `${process.env.NEXT_PUBLIC_BASE_URL}users/${tradeOffer.requesterId}/offers`,
          },
          recipients: [tradeOffer.requesterId.toString()],
          actor: actorId.toString(),
        });

        await knockClient.workflows.trigger("new-activity", {
          data: {
            tradeAction: "trade_canceled",
            listingName: listing.itemName,
            offerStatus: tradeOffer.offerStatus,
            tradeStatus: tradeOffer.tradeStatus,
            action_url: `${process.env.NEXT_PUBLIC_BASE_URL}tradeOffers?listingId=${tradeOffer.listingId}`,
          },
          recipients: [listing.userId.toString()],
          actor: actorId.toString(),
        });

        console.log("Knock Workflow Triggered for Trade Canceled");
      } catch (knockErr) {
        console.error("Knock Trigger Error:", knockErr.message);
      }
        
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
        
        try {
          await knockClient.workflows.trigger("new-activity", {
            data: {
              tradeAction: "trade_completed",
              listingName: listing.itemName,
              offerStatus: tradeOffer.offerStatus,
              tradeStatus: tradeOffer.tradeStatus,
              action_url: `${process.env.NEXT_PUBLIC_BASE_URL}users/${tradeOffer.requesterId}/offers`,
            },
            recipients: [tradeOffer.requesterId.toString()],
            actor: actorId.toString(),
          });

          await knockClient.workflows.trigger("new-activity", {
            data: {
              tradeAction: "trade_completed",
              listingName: listing.itemName,
              offerStatus: tradeOffer.offerStatus,
              tradeStatus: tradeOffer.tradeStatus,
              action_url: `${process.env.NEXT_PUBLIC_BASE_URL}tradeOffers?listingId=${tradeOffer.listingId}`,
            },
            recipients: [listing.userId.toString()],
            actor: actorId.toString(),
          });

          console.log("Knock Workflow Triggered for Trade Completed");
        } catch (knockErr) {
          console.error("Knock Trigger Error:", knockErr.message);
        }
        
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
