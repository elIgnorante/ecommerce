// Autor: Álvaro Zermeño
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes imports
import authRoutes from './routes/auth.route.js'; 
import productsRoutes from './routes/products.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';

import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares básicos
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Configuración de CORS para producción/desarrollo
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-render-app.onrender.com'] 
    : ['http://localhost:3000'],
  credentials: true
};
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Configuración para producción
if (process.env.NODE_ENV === 'production') {
  // Sirve archivos estáticos del frontend
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Maneja todas las demás rutas
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB().catch(err => console.error('Database connection error:', err));
});