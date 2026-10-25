require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");

const seedData = require("./data/seedData");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// put the sample holdings/positions in the db the first time we run
const seedDB = async () => {
  const holdingsCount = await HoldingsModel.countDocuments();
  if (holdingsCount === 0) {
    await HoldingsModel.insertMany(seedData.holdings);
    console.log("Sample holdings added");
  }

  const positionsCount = await PositionsModel.countDocuments();
  if (positionsCount === 0) {
    await PositionsModel.insertMany(seedData.positions);
    console.log("Sample positions added");
  }
};

app.get("/", (req, res) => {
  res.send("Zerodha clone backend is running");
});

// ---------- auth ----------

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered" });
    }

    const newUser = new UserModel({ username, email });
    const registeredUser = await UserModel.register(newUser, password);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: { id: registeredUser._id, username: registeredUser.username },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Username and password required" });
    }

    const { user, error } = await UserModel.authenticate()(username, password);

    if (error || !user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    res.json({
      success: true,
      message: "Logged in successfully",
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------- dashboard data ----------

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.get("/allOrders", async (req, res) => {
  let allOrders = await OrdersModel.find({}).sort({ createdAt: -1 });
  res.json(allOrders);
});

app.post("/newOrder", async (req, res) => {
  try {
    const { name, mode } = req.body;
    const qty = Number(req.body.qty);
    const price = Number(req.body.price);

    if (!name || !qty || qty <= 0 || !price || price <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid quantity and price" });
    }

    let holding = await HoldingsModel.findOne({ name });

    if (mode === "SELL") {
      if (!holding || holding.qty < qty) {
        return res
          .status(400)
          .json({ success: false, message: "Not enough quantity to sell" });
      }

      holding.qty -= qty;
      if (holding.qty === 0) {
        await HoldingsModel.deleteOne({ _id: holding._id });
      } else {
        await holding.save();
      }
    } else {
      if (holding) {
        const totalCost = holding.avg * holding.qty + price * qty;
        holding.qty += qty;
        holding.avg = Number((totalCost / holding.qty).toFixed(2));
        await holding.save();
      } else {
        holding = new HoldingsModel({
          name,
          qty,
          avg: price,
          price,
          net: "0.00%",
          day: "0.00%",
        });
        await holding.save();
      }
    }

    const newOrder = new OrdersModel({
      name,
      qty,
      price,
      mode: mode === "SELL" ? "SELL" : "BUY",
    });
    await newOrder.save();

    res.json({ success: true, message: "Order saved!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

mongoose
  .connect(uri)
  .then(async () => {
    console.log("DB connected!");
    await seedDB();

    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB:", err.message);
  });
