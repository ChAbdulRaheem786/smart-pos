const express = require("express");
const slugify = require("slugify");
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");
const { asyncHandler } = require("../middleware/errorHandler");
const { makeUploader, cloudinary } = require("../config/cloudinary");

const router = express.Router();
const upload = makeUploader("products");

// Helper: body fields arrive as strings (form-data). Colors/sizes are sent
// as JSON-stringified arrays or comma-separated strings — support both.
function parseListField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON, fall through to comma split
  }
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// GET /api/products — public. Supports ?category=slug, ?featured=true, ?search=, ?active=true
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category, featured, search } = req.query;
    const Category = require("../models/Category");

    const filter = { active: true };

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (!cat) return res.json([]);
      filter.category = cat._id;
    }
    if (featured === "true") filter.featured = true;
    if (search) filter.$text = { $search: search };

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json(products);
  })
);

// GET /api/products/admin/all — admin only, includes inactive products
router.get(
  "/admin/all",
  adminAuth,
  asyncHandler(async (req, res) => {
    const products = await Product.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });
    res.json(products);
  })
);

// GET /api/products/:slug — public, single product detail
router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, active: true }).populate(
      "category",
      "name slug"
    );
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  })
);

// POST /api/products — admin only, up to 6 images
router.post(
  "/",
  adminAuth,
  upload.array("images", 6),
  asyncHandler(async (req, res) => {
    const { name, description, price, discountPrice, category, colors, sizes, stock, sku, featured } =
      req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required." });
    }

    const slug = slugify(name, { lower: true, strict: true }) + "-" + Date.now().toString(36);

    const images = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename }));

    const product = await Product.create({
      name,
      slug,
      description: description || "",
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      category,
      images,
      colors: parseListField(colors),
      sizes: parseListField(sizes),
      stock: stock ? Number(stock) : 0,
      sku: sku || "",
      featured: featured === "true" || featured === true,
    });

    res.status(201).json(product);
  })
);

// PUT /api/products/:id — admin only. New images are appended unless replaceImages=true.
router.put(
  "/:id",
  adminAuth,
  upload.array("images", 6),
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    const {
      name,
      description,
      price,
      discountPrice,
      category,
      colors,
      sizes,
      stock,
      sku,
      featured,
      active,
      replaceImages,
      removeImagePublicIds,
    } = req.body;

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = discountPrice ? Number(discountPrice) : null;
    if (category) product.category = category;
    if (colors !== undefined) product.colors = parseListField(colors);
    if (sizes !== undefined) product.sizes = parseListField(sizes);
    if (stock !== undefined) product.stock = Number(stock);
    if (sku !== undefined) product.sku = sku;
    if (featured !== undefined) product.featured = featured === "true" || featured === true;
    if (active !== undefined) product.active = active === "true" || active === true;

    // Remove specific images if requested
    if (removeImagePublicIds) {
      const idsToRemove = parseListField(removeImagePublicIds);
      for (const publicId of idsToRemove) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      product.images = product.images.filter((img) => !idsToRemove.includes(img.publicId));
    }

    const newImages = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename }));

    if (replaceImages === "true" || replaceImages === true) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.publicId).catch(() => {});
      }
      product.images = newImages;
    } else if (newImages.length) {
      product.images = [...product.images, ...newImages];
    }

    await product.save();
    res.json(product);
  })
);

// DELETE /api/products/:id — admin only
router.delete(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.publicId).catch(() => {});
    }
    await product.deleteOne();
    res.json({ message: "Product deleted." });
  })
);

module.exports = router;
