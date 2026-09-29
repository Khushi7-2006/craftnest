const mongoose = require("mongoose");

const sellerSettingsSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellerSettings", sellerSettingsSchema);
