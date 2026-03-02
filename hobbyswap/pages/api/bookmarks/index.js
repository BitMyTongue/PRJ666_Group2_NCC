import { mongooseConnect } from "@/lib/dbUtils";
import { ListingModel } from "@/lib/listing";
import { BookmarkModel } from "@/lib/bookmark"; // ✅ correct import

export default async function handler(req, res) {
  const { method, query, body } = req;

  try {
    await mongooseConnect();

    // ✅ GET /api/bookmark?userId=123
    if (method === "GET") {
      const { userId } = query;
      if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
      }

      const bookmarks = await BookmarkModel.find({ userId })
        .exec();
      console.log("DB:", BookmarkModel.db.name);
      console.log("COLLECTION:", BookmarkModel.collection.name);
      return res.status(200).json({ bookmarks });
    }

    // ✅ POST /api/bookmark  { userId, listingId }
    if (method === "POST") {
      // const { userId, listingId } = body;
      const { userId, listingId, title, description, category, brand, condition, images } = req.body;


      if (!userId || !listingId) {
        return res.status(400).json({ error: "Missing userId or listingId" });
      }

      const listing = await ListingModel.findById(listingId).lean().exec();
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }

      if (method === "DELETE") {
        const { userId, listingId } = req.query;
        if (!userId || !listingId) {
          return res.status(400).json({ error: "Missing userId or listingId" });
        }

        await BookmarkModel.findOneAndDelete({ userId, listingId }).exec();
        return res.status(200).json({ message: "Bookmark removed" });
      }

      // Build snapshot fields for UI
      const doc = {
        userId,
        listingId,
        title: listing.title ?? listing.itemName ?? "Untitled",
        description: listing.description ?? "",
        category: listing.category ?? "Other",
        brand: listing.brand ?? "Unknown",
        condition: listing.condition ?? "Unknown",
        images: listing.images ?? [],
      };

      // ✅ upsert prevents duplicate bookmark errors
      // const bookmark = await BookmarkModel.findOneAndUpdate(
      //   { userId, listingId },
      //   { $setOnInsert: doc },
      //   { new: true, upsert: true }
      // ).exec();
      
      // prevent duplicates
      const existing = await BookmarkModel.findOne({ userId, listingId }).exec();
      if (existing) return res.status(200).json({ message: "Already bookmarked", bookmark: existing });

      const newBookmark = await BookmarkModel.create({
        userId,
        listingId,
        title,
        description,
        category,
        brand,
        condition,
        images,
      });

      return res.status(201).json({ message: "Bookmarked created", newBookmark });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);

    // duplicate key error (already bookmarked)
    if (err?.code === 11000) {
      return res.status(200).json({ message: "Already bookmarked" });
    }

    return res.status(500).json({ error: "Server error" });
  }
}