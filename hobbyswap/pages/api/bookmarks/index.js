import { mongooseConnect } from "@/lib/dbUtils";
import { ListingModel } from "@/lib/listing";
import { bookmark } from "@/lib/bookmark";

export default async function handler(req, res) {
    const { method } = req;

    try {
        await mongooseConnect();

        if (method === "GET") {
            const bookmarks = await bookmark.find().exec();
            return res.status(200).json({ bookmarks });
        }

        if (method === "POST") {
            const { userId, listingId } = req.body;

            if (!userId || !listingId) {
                return res.status(400).json({ error: "Missing userId or listingId" });
            }

            const listing = await ListingModel.findById(listingId).exec();
            if (!listing) {
                return res.status(404).json({ error: "Listing not found" });
            }
            
            const newBookmark = new bookmark({ userId, listingId });
            await newBookmark.save();
            return res.status(201).json({ message: "Bookmark created successfully", bookmark: newBookmark });

            const existingBookmark = await bookmark.findOne({ userId, listingId }).exec();
            if (existingBookmark) {
                return res.status(409).json({ error: "Bookmark already exists" });
            }
        }
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
} 