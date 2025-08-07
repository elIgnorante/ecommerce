
// Autor: Álvaro Zermeño
import express from "express";

import { getCartProducts, addToCart, removeAllFromCart, updateQuantity, cleanAllCart } from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', protectRoute, getCartProducts);
router.post('/', protectRoute,  addToCart);
router.delete('/', protectRoute, removeAllFromCart);
router.delete('/clean', protectRoute, cleanAllCart);
router.put('/:id', protectRoute, updateQuantity);

export default router