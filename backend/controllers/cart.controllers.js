import Cart from "../models/cart.model.js";
import mongoose from "mongoose";

// Fetch user's cart
export const getCart = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized: User not found' 
            });
        }

        // Fetch the user's cart and populate product details
        const cart = await Cart.findOne({ userId: req.user.userId })
            .populate('items.productId', 'name price image unit'); 
            
        // Return empty cart if none exists
        if (!cart) {
            return res.status(200).json({ 
                success: true, 
                message: 'Cart is empty', 
                cart: { items: [], subTotal: 0 } 
            });
        }

        // Filter out items with null/deleted products and clean up
        const validItems = cart.items.filter(item => {
            if (!item.productId) {
                console.log('Found item with null productId, removing...');
                return false;
            }
            return true;
        });

        // If we removed any invalid items, update the cart
        if (validItems.length !== cart.items.length) {
            cart.items = validItems;
            await cart.save();
            console.log(`Cleaned up cart: removed ${cart.items.length - validItems.length} invalid items`);
        }

        // Recalculate subtotal
        const subTotal = cart.items.reduce((total, item) => total + (item.total || 0), 0);

        // Return the cleaned cart
        res.status(200).json({ 
            success: true, 
            message: 'Cart fetched successfully', 
            cart: {
                ...cart.toObject(),
                subTotal
            }
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching cart', 
            error: error.message 
        });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    const { productId, quantity, price, image } = req.body;
    
    // Validation
    if (!productId || !quantity || !price) {
        return res.status(400).json({ 
            success: false, 
            message: 'Product ID, quantity, and price are required' 
        });
    }

    if (quantity <= 0 || price <= 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Quantity and price must be greater than 0' 
        });
    }

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid product ID format' 
        });
    }

    try {
        // Use consistent userId access
        const userId = req.user?.userId || req.userId;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized: User not found' 
            });
        }

        let cart = await Cart.findOne({ userId });
        
        if (cart) {
            // Find if the item already exists in the cart
            const itemIndex = cart.items.findIndex((item) => 
                item.productId && item.productId.toString() === productId
            );
            
            if (itemIndex > -1) {
                // If the item exists, update quantity
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].total = cart.items[itemIndex].quantity * price;
            } else {
                // If the item does not exist, add new item
                cart.items.push({ 
                    productId, 
                    quantity, 
                    price, 
                    image, 
                    total: quantity * price 
                });
            }
        } else {
            // If the cart doesn't exist, create a new one
            cart = new Cart({
                userId,
                items: [{ 
                    productId, 
                    quantity, 
                    price, 
                    image, 
                    total: quantity * price 
                }],
            });
        }

        // Save cart
        await cart.save();
        
        res.status(200).json({ 
            success: true, 
            message: 'Item added to cart', 
            cart 
        });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding item to cart', 
            error: error.message 
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    
    console.log('Attempting to remove product:', productId);
    
    // Validation
    if (!productId) {
        return res.status(400).json({ 
            success: false, 
            message: 'Product ID is required' 
        });
    }

    try {
        // Use consistent userId access
        const userId = req.user?.userId || req.userId;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized: User not found' 
            });
        }

        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }

        // Log current cart items for debugging
        console.log('Current cart items:', cart.items.map(item => ({
            productId: item.productId?.toString(),
            hasProductId: !!item.productId
        })));

        // Remove item from cart - handle both valid ObjectIds and null/undefined
        const initialLength = cart.items.length;
        
        cart.items = cart.items.filter((item) => {
            // Remove items with null/undefined productId OR matching productId
            if (!item.productId) {
                console.log('Removing item with null productId');
                return false;
            }
            
            const itemProductId = item.productId.toString();
            const shouldRemove = itemProductId === productId;
            
            if (shouldRemove) {
                console.log('Removing item with matching productId:', itemProductId);
            }
            
            return !shouldRemove;
        });

        const removedCount = initialLength - cart.items.length;
        console.log(`Removed ${removedCount} items from cart`);

        if (removedCount === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found in cart' 
            });
        }

        await cart.save();
        
        res.status(200).json({ 
            success: true, 
            message: `Removed ${removedCount} item(s) from cart`, 
            cart 
        });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error removing item from cart', 
            error: error.message 
        });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        // Use consistent userId access
        const userId = req.user?.userId || req.userId;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized: User not found' 
            });
        }

        const cart = await Cart.findOneAndUpdate(
            { userId },
            { items: [], subTotal: 0 },
            { new: true }
        );
        
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Cart cleared successfully', 
            cart 
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error clearing cart', 
            error: error.message 
        });
    }
};

// Clean up cart - Remove items with null/invalid productId (utility function)
export const cleanupCart = async (req, res) => {
    try {
        const userId = req.user?.userId || req.userId;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized: User not found' 
            });
        }

        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: 'Cart not found' 
            });
        }

        const initialLength = cart.items.length;
        
        // Remove items with null/undefined productId
        cart.items = cart.items.filter(item => {
            return item.productId && mongoose.Types.ObjectId.isValid(item.productId);
        });

        const cleanedCount = initialLength - cart.items.length;
        
        if (cleanedCount > 0) {
            await cart.save();
        }

        res.status(200).json({ 
            success: true, 
            message: `Cleaned up ${cleanedCount} invalid items from cart`, 
            cart 
        });
    } catch (error) {
        console.error('Error cleaning up cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error cleaning up cart', 
            error: error.message 
        });
    }
};