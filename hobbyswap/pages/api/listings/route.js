import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { v4 as uuid } from "uuid";

const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function TO_POST(req) { // Post testing from differnt fomponent for AWS
  const formData = await req.formData();
  const files = formData.getAll("files");

  if (!files.length) {
    return NextResponse.json({ success: false, message: "No files" }, { status: 400 });
  }

  try {
    const imageUrls = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `listings/${uuid()}-${file.name}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      imageUrls.push(url);
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrls,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
