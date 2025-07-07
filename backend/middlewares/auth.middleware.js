// Autor: Álvaro Zermeño
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req, res, next) => {
  try {
    const accesToken = req.cookies.accessToken;

    if (!accesToken) {
      return res
        .status(401)
        .json({ message: "Unathorized - No access token provided" });
    }

    try {
      const decoded = jwt.verify(accesToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user; // Usuario autenticado
      next(); // Continúa con la siguiente función middleware o ruta

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Access token expired" });
        }
        throw error; // Lanza el error para manejarlo en el bloque try-catch padre
    }

  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Unauthorized - Invalid access token" });
  }
};

export const adminRoute = (req, res, next) => {
    if ( req.user && req.user.role === "admin") {
        next(); // Continúa con la siguiente función middleware o ruta
    } else {
        return res.status(403).json({ message: "Access denied - Admin access required" });
    }
}