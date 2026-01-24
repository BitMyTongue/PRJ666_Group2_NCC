import formidable from "formidable";
import { promises as fs } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({ multiples: true });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
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

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedFilesUrls = [];

    for (const file of uploadedFiles) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const newFileName = `${uniqueSuffix}-${file.originalFilename}`;
      const newFilePath = path.join(uploadDir, newFileName);

      await fs.copyFile(file.filepath, newFilePath);
      await fs.unlink(file.filepath);

      uploadedFilesUrls.push(`/uploads/${newFileName}`);
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
