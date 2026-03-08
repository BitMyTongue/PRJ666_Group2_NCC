// lib/bookmarks.js
const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    listingId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Uncategorized" },
    brand: { type: String, default: "Unknown" },
    condition: { type: String, default: "Unknown" },
    images: { type: [String], default: [] },
    dateBookmarked: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, listingId: 1 }, { unique: true });


export const BookmarkModel =
  mongoose.models.bookmarks || mongoose.model("bookmarks", bookmarkSchema, "bookmarks");