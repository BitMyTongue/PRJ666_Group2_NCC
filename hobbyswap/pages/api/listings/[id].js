import { mongooseConnect } from "@/lib/dbUtils";
import { ListingModel } from "@/lib/listing";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

function s3KeyFromUrl(url) {
  try {
    const pathname = new URL(url).pathname; // e.g. "/listings/user/images/uuid-name.jpg"
    return pathname.replace(/^\/+/, "");
  } catch (e) {
    // If parsing fails, assume the value is already an S3 key
    return url;
  }
}

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

    else if (method === "PUT") {

      const { images = [], ...updates } = req.body; // Images as S3 URL arrays + other fields

      const listing = await ListingModel.findById(id);
      if (!listing) return res.status(404).json({ error: "Listing not found" });

      const oldImages = listing.images || [];
      // Keep only valid http(s) URLs (ignore blob: preview URLs from client)
      const sanitizedImages = Array.isArray(images) ? images.filter((u) => typeof u === "string" && /^https?:\/\//.test(u)) : [];
      const toDelete = oldImages.filter((img) => !sanitizedImages.includes(img));

      // DELETE REMOVED IMAGES FROM S3
      if (toDelete.length > 0) {
        console.log(toDelete)
        try {
          const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          });

          await Promise.all(
            toDelete.map(async (imgUrl) => {
              const Key = s3KeyFromUrl(imgUrl);
              if (!Key) return;
              await s3.send(
                new DeleteObjectCommand({
                  Bucket: process.env.AWS_S3_BUCKET,
                  Key,
                })
              );
            })
          );
        } catch (err) {
          console.error("S3 delete error:", err);
          return res.status(500).json({ error: "Failed to delete old images from S3" });
        }
      }

      // Apply updates and save
      Object.assign(listing, updates);
      listing.images = sanitizedImages;
      await listing.save();

      const updated = await ListingModel.findById(id).populate("userId");

      return res.status(200).json({ listing: updated });
    }

    res.setHeader("Allow", ["GET, PUT"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error("LISTING BY ID API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
