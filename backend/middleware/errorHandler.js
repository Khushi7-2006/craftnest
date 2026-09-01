// Centralized error handler. Never leaks raw backend errors/stack traces to the client.
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  const message = statusCode === 500 ? "Something went wrong. Please try again later." : err.message;

  res.status(statusCode).json({ message });
};

// Wraps a 404 for unknown API routes.
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
