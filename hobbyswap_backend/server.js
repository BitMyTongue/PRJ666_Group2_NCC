const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8080;

app.get("/", (req, res) => {
    res.send("Welcome to Hobby Swap");
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})