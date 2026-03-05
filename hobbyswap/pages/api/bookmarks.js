import { mongooseConnect } from "@/lib/dbUtils";
import { BookmarkModel } from "@/lib/bookmark";

export default async function handler(req, res) {
  const { method } = req;
  const { listingId, userId } = req.body;

  try {
    await mongooseConnect();
    switch (method) {
      case "GET":
        let bookmarks = await BookmarkModel.find({}).exec();
        return res.status(200).json({ bm: bookmarks });

      case "POST":
        // validate required fields
        if (!userId) return res.status(401).json({ error: "UserId not found" });
        if (!listingId)
          return res.status(401).json({ error: "ListingId not found" });

        // Create listing
        let newBookmark = new BookmarkModel({
          userId,
          listingId,
        });
          await newBookmark.save();
          res
            .status(201)
            .json({ message: "Add Listing to Bookmark", bookmark: newBookmark });
        break;
      case "DELETE":
        // validate required fields
        if (!userId) return res.status(401).json({ error: "UserId not found" });
        if (!listingId)
          return res.status(401).json({ error: "ListingId not found" });

        const deletedBookmark = await BookmarkModel.findOneAndDelete({
          listingId,
          userId,
        });

        if (!deletedBookmark) {
          return res.status(404).json({ error: "Bookmark not found" });
        }

        res.status(200).json({ message: "Bookmark removed successfully" });
        break;
      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error("BOOKMARK API ERROR:", err);
    return res.status(500).json({
      error: err.message,
    });
  }
}

