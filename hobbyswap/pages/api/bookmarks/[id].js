import { mongooseConnect } from "@/lib/dbUtils";
import { BookmarkModel } from "@/lib/bookmarks";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  try {
    await mongooseConnect();

    if (!id) {
      return res.status(400).json({ error: "Bookmark id is required" });
    }

    if (method === "GET") {
      const bookmarkData = await BookmarkModel.findById(id);

      if (!bookmarkData) {
        return res.status(404).json({ error: "Bookmark not found" });
      }

      return res.status(200).json({ bookmark: bookmarkData });
    }

    if (method === "DELETE") {
      const bookmarkToDelete = await BookmarkModel.findById(id);

      if (!bookmarkToDelete) {
        return res.status(404).json({ error: "Bookmark not found" });
      }

      await BookmarkModel.findByIdAndDelete(id);

      return res
        .status(200)
        .json({ message: "Bookmark deleted successfully" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Bookmark [id] API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
