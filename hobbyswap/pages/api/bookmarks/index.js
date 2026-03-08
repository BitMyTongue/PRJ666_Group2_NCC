// pages/api/bookmarks/index.js
import { mongooseConnect } from "@/lib/dbUtils";
import { BookmarkModel } from "@/lib/bookmarks";

export default async function handler(req, res) {
  try {
    await mongooseConnect();

    if (req.method === "POST") {
      const body = req.body || {};
      const { userId, listingId } = body;

      if (!userId) return res.status(400).json({ error: "Missing userId" });
      if (!listingId) return res.status(400).json({ error: "Missing listingId" });

      const doc = await BookmarkModel.findOneAndUpdate(
        { userId, listingId },
        {
          $set: {
            userId,
            listingId,
            title: body.title ?? "Untitled",
            description: body.description ?? "",
            category: body.category ?? "Uncategorized",
            brand: body.brand ?? "Unknown",
            condition: body.condition ?? "Unknown",
            images: Array.isArray(body.images) ? body.images : [],
            dateBookmarked: new Date(),
          },
        },
        {
          upsert: true,
          returnDocument: "after", // ✅ replaces deprecated `new: true`
          runValidators: true,
        }
      );

      return res.status(200).json({ ok: true, saved: true, bookmark: doc });
    }

    if (req.method === "GET") {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "Missing userId" });

      const docs = await BookmarkModel.find({ userId })
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({ ok: true, bookmarks: docs });
    }

    if (req.method === "DELETE") {
      const { userId, listingId } = req.query;
      if (!userId) return res.status(400).json({ error: "Missing userId" });
      if (!listingId) return res.status(400).json({ error: "Missing listingId" });

      await BookmarkModel.deleteOne({ userId, listingId });
      return res.status(200).json({ ok: true, saved: false });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("API /bookmarks error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}