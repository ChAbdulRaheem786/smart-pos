const mongoose = require("mongoose");

const bannerImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    link: { type: String, default: "" }, // optional: category/product slug to link to
    title: { type: String, default: "" },
  },
  { _id: true }
);

const settingsSchema = new mongoose.Schema(
  {
    // Singleton document — there is only ever one Settings row (key: "main").
    key: { type: String, default: "main", unique: true },
    siteName: { type: String, default: "My Store" },
    headerBanners: { type: [bannerImageSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
