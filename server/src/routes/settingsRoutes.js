const express = require("express");
const Settings = require("../models/Settings");
const adminAuth = require("../middleware/adminAuth");
const { asyncHandler } = require("../middleware/errorHandler");
const { makeUploader, cloudinary } = require("../config/cloudinary");

const router = express.Router();
const upload = makeUploader("banners");

async function getOrCreateSettings() {
  let settings = await Settings.findOne({ key: "main" });
  if (!settings) settings = await Settings.create({ key: "main" });
  return settings;
}

// GET /api/settings — public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const settings = await getOrCreateSettings();
    res.json(settings);
  })
);

// POST /api/settings/banners — admin only, add one banner image
router.post(
  "/banners",
  adminAuth,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Banner image is required." });

    const settings = await getOrCreateSettings();
    settings.headerBanners.push({
      url: req.file.path,
      publicId: req.file.filename,
      link: req.body.link || "",
      title: req.body.title || "",
    });
    await settings.save();
    res.status(201).json(settings);
  })
);

// DELETE /api/settings/banners/:bannerId — admin only
router.delete(
  "/banners/:bannerId",
  adminAuth,
  asyncHandler(async (req, res) => {
    const settings = await getOrCreateSettings();
    const banner = settings.headerBanners.id(req.params.bannerId);
    if (!banner) return res.status(404).json({ message: "Banner not found." });

    await cloudinary.uploader.destroy(banner.publicId).catch(() => {});
    banner.deleteOne();
    await settings.save();
    res.json(settings);
  })
);

// PUT /api/settings — admin only, update site name etc.
router.put(
  "/",
  adminAuth,
  asyncHandler(async (req, res) => {
    const settings = await getOrCreateSettings();
    if (req.body.siteName !== undefined) settings.siteName = req.body.siteName;
    await settings.save();
    res.json(settings);
  })
);

module.exports = router;
