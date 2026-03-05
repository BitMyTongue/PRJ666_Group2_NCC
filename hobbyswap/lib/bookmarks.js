// lib/bookmarks.js
const mongoose = require("mongoose");

// Keep schema name consistent and avoid missing schema errors
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

// prevent duplicates
bookmarkSchema.index({ userId: 1, listingId: 1 }, { unique: true });

/**
 * IMPORTANT:
 * - Your listing model uses mongoose.model("listings", ...) (model name == collection name).
 * - To match that pattern AND force plural, we use model name "bookmarks"
 * - The third parameter also forces the Mongo collection name to "bookmarks"
 */
export const BookmarkModel =
  mongoose.models.bookmarks || mongoose.model("bookmarks", bookmarkSchema, "bookmarks");