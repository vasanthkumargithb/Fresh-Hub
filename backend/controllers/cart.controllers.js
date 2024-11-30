import Cart from "../models/cart.model.js"

// Fetch user's cart
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) return res.status(200).json({ items: [], subTotal: 0 });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    const { productId, quantity, price } = req.body;
    try {
        let cart = await Cart.findOne({ userId: req.user.id });

        if (cart) {
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].total = cart.items[itemIndex].quantity * price;
            } else {
                cart.items.push({ productId, quantity, price, total: quantity * price });
            }
        } else {
            cart = new Cart({
                userId: req.user.id,
                items: [{ productId, quantity, price, total: quantity * price }],
            });
        }

        await cart.save();
        res.status(200).json({ message: 'Item added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

        await cart.save();
        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.user.id },
            { items: [], subTotal: 0 },
            { new: true }
        );
        res.status(200).json({ message: 'Cart cleared', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
};


