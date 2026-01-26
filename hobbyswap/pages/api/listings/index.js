import { mongooseConnect } from "@/lib/dbUtils";
import { ListingModel } from "@/lib/listing";


export default async function handler(req, res) {
    const { method } = req;

    try {
        await mongooseConnect();
        switch (method) {
            case "GET":
                let listings = await ListingModel.find().exec();
                res.status(200).json({ listings });
                break;

            case "POST":
                const { itemName, description, category, condition, images, meetUp, location, requestItems, requestMoney, userId } = req.body;

                // validate required fields
                if (!userId) return res.status(401).json({ error: "UserId not found" });
                if (!itemName) return res.status(400).json({ error: "Missing Item Name" });
                if (!description) return res.status(400).json({ error: "Missing Description" });
                if (!category) return res.status(400).json({ error: "Missing Category" });
                if (!condition) return res.status(400).json({ error: "Missing Condition" });

                // if meet up checked, must provide a meet up location
                if (meetUp === true && (!location || String(location).trim() === "")) {
                    return res.status(400).json({ error: "If meet up option is offered, you must provide a meet up location." });
                }
                
                // listing must request item(s) and/or money
                const itemArr = Array.isArray(requestItems) ? requestItems: [];
                const moneyNum = Number(requestMoney) || 0;

                if (!(itemArr.length > 0) && !(moneyNum > 0))
                    return res.status(400).json({ error: "You must request item(s) and/or money."});

                // Create listing
                let newListing = new ListingModel({ itemName, description, category, condition, images, meetUp, location, requestItems: itemArr, requestMoney: moneyNum, userId, status: "ACTIVE",  });
                await newListing.save();
                res.status(201).json({ message: "Listing Created", listing: newListing });
                break;

            default:
                res.setHeader("Allow", ["GET", "POST"]);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    }
    catch (err) {
    console.error("LISTINGS API ERROR:", err);
    return res.status(500).json({
        error: err.message,
    });
    }
}