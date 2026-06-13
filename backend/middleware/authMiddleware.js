const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const parts = authHeader.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ message: "Invalid token format" });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;