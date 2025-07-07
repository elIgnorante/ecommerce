// Autor: Álvaro Zermeño
import express from 'express';
import { getAllProducts , getFeaturedProducts, getRecommendedProducts, getProductsByCategory, createProduct, toggleFeaturedProduct, deleteProduct } from '../controllers/product.controller.js';
import { protectRoute, adminRoute } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/recommended', getRecommendedProducts);
router.get('/category/:category', getProductsByCategory);
router.post('/', protectRoute, adminRoute, createProduct);
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct);
router.delete('/:id', protectRoute, adminRoute, deleteProduct);

export default router;
