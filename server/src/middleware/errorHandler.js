// Wrap async route handlers so thrown errors / rejected promises reach the
// error-handling middleware instead of crashing the function or hanging.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Express error handler — must be registered last with app.use().
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `That ${field} is already in use.` });
  }
  if (err instanceof require("multer").MulterError) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Something went wrong on the server." });
}

function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { asyncHandler, errorHandler, notFound };
