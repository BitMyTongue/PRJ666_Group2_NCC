import { mongooseConnect } from "@/lib/dbUtils";
import { ListingModel } from "@/lib/listing";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  try {
    await mongooseConnect();

    if (method === "GET") {
      const listing = await ListingModel
        .findById(id)
        .populate("userId"); // 👈 THIS is the fix

      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }

      return res.status(200).json({ listing });
    }

    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error("LISTING BY ID API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
