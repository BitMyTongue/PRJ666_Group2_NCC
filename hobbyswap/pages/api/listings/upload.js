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
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({ multiples: true });

  try {
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const imageFiles = files.files; // match frontend "files"
    if (!imageFiles) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const uploadedFiles = Array.isArray(imageFiles) ? imageFiles : [imageFiles];

    //Previous Logic for local upload
    // const uploadDir = path.join(process.cwd(), "public", "uploads");
    // await fs.mkdir(uploadDir, { recursive: true });

    const uploadedFilesUrls = [];

    for (const file of uploadedFiles) {

      const fileBuffer = await fs.readFile(file.filepath);
      const key = `listings/${uuid()}-${file.originalFilename}`;

      await S3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
          Body: fileBuffer,
          ContentType: file.mimetype,
        })
      );

      //Previous uploaded Files URL images
      // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // const newFileName = `${uniqueSuffix}-${file.originalFilename}`;
      // const newFilePath = path.join(uploadDir, newFileName);
      // await fs.copyFile(file.filepath, newFilePath);
      // uploadedFilesUrls.push(`/uploads/${newFileName}`);

      
      // Public S3 URL
      const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      uploadedFilesUrls.push(imageUrl);
      
      //Clean up Temporary file (not saved - Locally)
      await fs.unlink(file.filepath);
    }

    res.status(200).json({
      success: true,
      imageUrl: uploadedFilesUrls,
    });
  } catch (error) {
    console.error("Error upload: ", error);
    res.status(500).json({ message: "Fail to upload" });
  }
}
