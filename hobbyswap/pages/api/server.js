const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const { UserModel, mongooseConnect } = require("../../lib/dbUtils"); 

const app = express();
app.use(express.json());

// Demo data (replace with DB query if you want)
const listings = [];

let refreshTokens = [];

app.post("/login", async (req, res) => {
  const { email, username, password } = req.body;

  // allow either email or username in request
  const identifier = email || username;

  if (!identifier || !password) {
    return res.status(400).json({ error: "Email/username and password are required" });
  }

  try {
    await mongooseConnect();

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).exec();

    if (!user) {
      return res.status(401).json({ error: "Invalid email/username or password" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email/username or password" });
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT_SECRET, {
      expiresIn: "7d",
    });

    refreshTokens.push(refreshToken);

    return res.json({ accessToken, refreshToken });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


app.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    // user is the decoded payload
    const accessToken = generateAccessToken({
      userId: user.userId,
      email: user.email,
      username: user.username,
    });

    return res.json({ accessToken });
  });
});


app.delete("/logout", (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((t) => t !== refreshToken);
  return res.sendStatus(204);
});


app.get("/listings", authenticateToken, (req, res) => {
  // req.user comes from access token payload
  return res.json(listings.filter((l) => l.username === req.user.username));
});

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  // ✅ Verify with JWT_SECRET (not JWT_SECRET)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; 
    next();
  });
}

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
