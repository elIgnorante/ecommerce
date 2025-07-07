// Autor: Álvaro Zermeño
import Product from "../models/products.model.js";
import {redis} from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";


export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}); // obtener todos los productos
        res.json({ products });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products"); // intenta obtener los productos destacados de la caché
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts)); // si los productos destacados están en caché, los devuelve
        }

        // si no están en caché, los obtiene de la base de datos
        // .lean() convierte el resultado en un objeto JavaScript simple, sin métodos de Mongoose
        // lo que mejora el rendimiento al evitar la sobrecarga de Mongoose
        featuredProducts = await Product.find({ isFeatured: true }).lean(); // obtener productos destacados
        if ( !featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }

        await redis.set("featured_products", JSON.stringify(featuredProducts)); // almacena los productos destacados en la caché
        res.json(featuredProducts); // devuelve los productos destacados

    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 } // selecciona 3 productos aleatorios
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    image: 1,
                } // proyecta solo los campos necesarios
            }
        ]); // obtiene todos los productos usando agregación

        res.json(products); // devuelve los productos recomendados
    } catch (error) {
        console.error("Error fetching recommended products:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });

    }
};

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params; // obtiene la categoría de los parámetros de la solicitud
    try {
        const products = await Product.find({ category }); // busca productos por categoría
        res.json(products); // devuelve los productos encontrados
    } catch (error) {
        console.error("Error fetching products by category:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, isFeatured } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" })
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        });

        res.status(201).json(product); // devuelve el producto creado con un código de estado 201 (creado)
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // busca el producto por ID
        if ( product) {
            product.isFeatured = !product.isFeatured; // cambia el estado de isFeatured
            const updatedProduct = await product.save(); // guarda los cambios en la base de datos

            await updateFeaturedProductsCache(); // actualiza la caché de productos destacados

            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" }); // si no se encuentra el producto, devuelve un error 404
        }
    } catch (error) {
        console.error("Error toggling featured product:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id); // busca y elimina el producto por ID

        if (!product) {
            return res.status(404).json({ message: "Product not found" }); // si no se encuentra el producto, devuelve un error 404
        }

        if(product.image) {
            const publicId = product.image.split("/").pop().split(".")[0]; // extrae el public ID de la imagen
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`); // elimina la imagen de Cloudinary
                console.log("Image deleted from Cloudinary");
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }

        await Product.findByIdAndDelete(req.params.id); // elimina el producto de la base de datos

        res.json({ message: "Product deleted successfully" }); // devuelve un mensaje de éxito

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


async function updateFeaturedProductsCache() {
    try {
        // .lean() convierte el resultado en un objeto JavaScript simple, sin métodos de Mongoose
        // lo que mejora el rendimiento al evitar la sobrecarga de Mongoose
        const featuredProducts = await Product.find({ isFeatured: true }).lean(); // obtiene los productos destacados
        await redis.set("featured_products", JSON.stringify(featuredProducts)); // almacena los productos destacados en la caché
    } catch (error) {
        console.error("Error updating featured products cache:", error);
        res.status(500).json({ message: "Server error - Error updating featured", error: error.message });
    }
};
