// Autor: Álvaro Zermeño
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

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

// Resolviendo el directorio actual para servir archivos estáticos correctamente
// Esto es parte de la configuración para servir el frontend en producción
const __dirname = path.resolve();

app.use(express.json({limit: "10mb"})); // Middleware para parsear JSON
app.use(cookieParser()); // Middleware para parsear cookies

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Middleware para servir archivos estáticos en producción
// Esto permite que el frontend construido con React se sirva correctamente al cliente
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    
    // Esto redirige todas las solicitudes al archivo index.html del frontend
    // Esto es necesario para que las rutas del frontend funcionen correctamente
    // Para de esta forma permitir el enrutamiento del lado del cliente
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
})


