import formidable from "formidable";
import { promises as fs } from "fs";
import path from "path";
//AWS Integration
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

//S3 Client
const S3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed", "data": req.body });
  }

  const form = formidable({ multiples: false });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;

    const imageFile = files.file; // match frontend "file" (single file)
    if (!imageFile) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const file = Array.isArray(imageFile) ? imageFile[0] : imageFile;

    const fileBuffer = await fs.readFile(file.filepath);
    const key = `users/${userId}/images/profile/${uuid()}-${file.originalFilename}`;

    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: file.mimetype,
      })
    );

    // Public S3 URL
    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    //Clean up Temporary file
    await fs.unlink(file.filepath);

    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error upload: ", error);
    res.status(500).json({ message: "Fail to upload" });
  }
}
