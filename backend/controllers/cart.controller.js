// Autor: Álvaro Zermeño
import Product from "../models/products.model.js";


export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({_id:{$in:req.user.cartItems}});

        //Añadir la cantidad a cada producto
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItem => cartItem.product.toString() === product._id.toString());
            return {
              ...product.toJSON(), quantity:item.quantity
            }
        });
        console.log("Cart items enviados al frontend:", cartItems);
        res.json(cartItems);
    } catch (error) {
      console.error("Error in getCartProducts", error.message);
      res.status(500).json({message: "Server error", error: error.message});
        
    }
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
    

		const existingItem = user.cartItems.find((item) => item.product.toString() === productId);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({ product: productId, quantity: 1 });
		}
    
  
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.error("Error in removeAllFromCart controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.product.toString() === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
        res.status(404).json({message: "Product not found"});
    }
  } catch (error) {
    console.error("Error in updateQuantity controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
