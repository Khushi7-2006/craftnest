const mongoose = require("mongoose");

const sellerSettingsSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true,
      trim: true,
    },

    sellerPassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SellerSettings",
  sellerSettingsSchema
);
