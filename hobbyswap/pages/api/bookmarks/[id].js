import { mongooseConnect } from "@/lib/dbUtils";
import { bookmark } from "@/lib/bookmark";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
    const { method, query } = req;
    const { id } = query;

    try {
        await mongooseConnect();

        if (method === "GET") {
            const bookmarkData = await bookmark.findById(id);
            if (!bookmarkData) {
                return res.status(404).json({ error: "Bookmark not found" });
            }
            return res.status(200).json({ bookmark: bookmarkData });
        }   

        if (method === "DELETE") {
            const bookmarkToDelete = await bookmark.findById(id);
            if (!bookmarkToDelete) {
                return res.status(404).json({ error: "Bookmark not found" });
            }

            // Delete images from S3
            const s3 = new S3Client({
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            });

            for (const imageUrl of bookmarkToDelete.images) {
                const imageKey = imageUrl.split("/").slice(-1)[0];
                const deleteParams = {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: imageKey,
                };
                await s3.send(new DeleteObjectCommand(deleteParams));
            }

            await bookmark.findByIdAndDelete(id);
            return res.status(200).json({ message: "Bookmark deleted successfully" });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}   