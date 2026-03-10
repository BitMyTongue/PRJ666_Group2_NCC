import { mongooseConnect, UserModel } from "@/lib/dbUtils";
import { TradeOfferModel } from "@/lib/tradeOffer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const { reviewerId, rating, title, description, tradeOfferId } = req.body;

  try {
    await mongooseConnect();

    // Validate required fields
    if (!id || !reviewerId || !rating || !title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create review object
    const newReview = {
      reviewerId,
      rating: parseInt(rating),
      title,
      description,
      tradeOfferId: tradeOfferId || null,
      createdAt: new Date(),
    };

    // Add review to user's reviews array
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $push: { reviews: newReview } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // If tradeOfferId is provided, also add review to trade offer
    if (tradeOfferId) {
      const tradeOfferReview = {
        reviewerId,
        rating: parseInt(rating),
        title,
        description,
        createdAt: new Date(),
      };

      await TradeOfferModel.findByIdAndUpdate(
        tradeOfferId,
        { $push: { reviews: tradeOfferReview } },
        { new: true }
      );
    }

    return res.status(200).json({
      message: "Review submitted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
