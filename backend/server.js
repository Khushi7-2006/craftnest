require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

connectDB();

const app = express();

// Credentialed CORS: never use origin "*" here, since cookies require a specific,
// known origin. FRONTEND_URL should be the deployed Vercel URL in production.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "CraftNest API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

// Render assigns PORT dynamically and expects the server to bind on 0.0.0.0.
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`CraftNest API listening on port ${PORT}`));
