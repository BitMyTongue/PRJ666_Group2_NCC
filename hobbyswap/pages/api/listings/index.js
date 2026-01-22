import { ListingModel, mongooseConnect } from "@/lib/dbUtils";

export default async function handler(req, res) {
    const { title, description, category, brand, condition, images, status, location, userId } = req.body;
    const { method } = req;

    try {
        await mongooseConnect();
        switch (method) {
            case "GET":
                let listings = await ListingModel.find().exec();
                res.status(200).json({ listings });
                break;
            case "POST":
                let newListing = new ListingModel({ title, description, category, brand, condition, images, status, location, userId });
                await newListing.save();
                res.status(201).json({ message: "Listing Created", listing: newListing });
                break;
            default:
                res.setHeader("Allow", ["GET", "POST"]);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}