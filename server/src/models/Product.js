const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    images: { type: [imageSchema], default: [] },
    colors: { type: [String], default: [] }, // e.g. ["Red", "Black"]
    sizes: { type: [String], default: [] }, // e.g. ["S", "M", "L", "XL"]
    stock: { type: Number, default: 0 },
    sku: { type: String, default: "" },
    featured: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
