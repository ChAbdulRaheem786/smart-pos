const express = require("express");
const slugify = require("slugify");
const Category = require("../models/Category");
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");
const { asyncHandler } = require("../middleware/errorHandler");
const { makeUploader, cloudinary } = require("../config/cloudinary");

const router = express.Router();
const upload = makeUploader("categories");

// GET /api/categories — public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
    res.json(categories);
  })
);

// GET /api/categories/:slug — public, single category by slug
router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found." });
    res.json(category);
  })
);

// POST /api/categories — admin only
router.post(
  "/",
  adminAuth,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const { name, description, sortOrder } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required." });

    const slug = slugify(name, { lower: true, strict: true });

    const category = await Category.create({
      name,
      slug,
      description: description || "",
      sortOrder: sortOrder ? Number(sortOrder) : 0,
      image: req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : { url: "", publicId: "" },
    });

    res.status(201).json(category);
  })
);

// PUT /api/categories/:id — admin only
router.put(
  "/:id",
  adminAuth,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found." });

    const { name, description, sortOrder } = req.body;

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) category.description = description;
    if (sortOrder !== undefined) category.sortOrder = Number(sortOrder);

    if (req.file) {
      if (category.image?.publicId) {
        await cloudinary.uploader.destroy(category.image.publicId).catch(() => {});
      }
      category.image = { url: req.file.path, publicId: req.file.filename };
    }

    await category.save();
    res.json(category);
  })
);

// DELETE /api/categories/:id — admin only
router.delete(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found." });

    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete: ${productCount} product(s) still belong to this category. Move or delete them first.`,
      });
    }

    if (category.image?.publicId) {
      await cloudinary.uploader.destroy(category.image.publicId).catch(() => {});
    }
    await category.deleteOne();
    res.json({ message: "Category deleted." });
  })
);

module.exports = router;
