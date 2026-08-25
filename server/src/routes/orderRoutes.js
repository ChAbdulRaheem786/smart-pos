const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");
const { asyncHandler } = require("../middleware/errorHandler");
const { makeUploader, cloudinary } = require("../config/cloudinary");

const router = express.Router();
const upload = makeUploader("payment-proofs");

// POST /api/orders — public. multipart/form-data with a single "paymentProof" file
// and a JSON-stringified "items" field: [{ productId, quantity, color, size }]
router.post(
  "/",
  upload.single("paymentProof"),
  asyncHandler(async (req, res) => {
    const { fullName, phone, email, address, city, notes, items } = req.body;

    if (!fullName || !phone || !address || !city) {
      return res.status(400).json({ message: "Full name, phone, address, and city are required." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Payment proof image is required." });
    }
    if (!items) {
      return res.status(400).json({ message: "No items in order." });
    }

    let parsedItems;
    try {
      parsedItems = JSON.parse(items);
    } catch {
      return res.status(400).json({ message: "Invalid items format." });
    }
    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      return res.status(400).json({ message: "No items in order." });
    }

    // Rebuild items from the DB so prices can't be tampered with client-side.
    const orderItems = [];
    let totalAmount = 0;

    for (const item of parsedItems) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const unitPrice = product.discountPrice ?? product.price;
      const quantity = Math.max(1, Number(item.quantity) || 1);

      orderItems.push({
        product: product._id,
        name: product.name,
        price: unitPrice,
        quantity,
        color: item.color || "",
        size: item.size || "",
        image: product.images?.[0]?.url || "",
      });
      totalAmount += unitPrice * quantity;
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "None of the submitted items were valid." });
    }

    const order = await Order.create({
      items: orderItems,
      totalAmount,
      customer: { fullName, phone, email: email || "", address, city, notes: notes || "" },
      paymentProof: { url: req.file.path, publicId: req.file.filename },
    });

    res.status(201).json({ message: "Order placed successfully.", orderId: order._id });
  })
);

// GET /api/orders — admin only. Supports ?status=
router.get(
  "/",
  adminAuth,
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  })
);

// GET /api/orders/:id — admin only
router.get(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  })
);

// PATCH /api/orders/:id/status — admin only
router.patch(
  "/:id/status",
  adminAuth,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "shipped", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}` });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  })
);

// DELETE /api/orders/:id — admin only
router.delete(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.paymentProof?.publicId) {
      await cloudinary.uploader.destroy(order.paymentProof.publicId).catch(() => {});
    }
    await order.deleteOne();
    res.json({ message: "Order deleted." });
  })
);

module.exports = router;
