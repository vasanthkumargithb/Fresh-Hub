// cart.test.js - Unit tests for cart functionality
import request from 'supertest';
import app from '../server.js'; // Adjust path as needed
import Cart from '../models/cart.model.js';
import jwt from 'jsonwebtoken';

// Mock the Cart model
jest.mock('../models/cart.model.js');

describe('Cart API Tests', () => {
    let authToken;
    let userId;

    beforeEach(() => {
        // Create a mock JWT token for testing
        userId = '64f8d5e2c123456789abcdef';
        authToken = jwt.sign(
            { userId: userId },
            process.env.JWT_SECRET || 'test-secret',
            { expiresIn: '1h' }
        );
        
        // Clear all mocks
        jest.clearAllMocks();
    });

    describe('GET /api/cart', () => {
        it('should fetch user cart successfully', async () => {
            const mockCart = {
                userId: userId,
                items: [
                    {
                        productId: '64f8d5e2c123456789abcd01',
                        quantity: 2,
                        price: 25.99,
                        image: 'test.jpg',
                        total: 51.98
                    }
                ],
                subTotal: 51.98
            };

            Cart.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockCart)
            });

            const response = await request(app)
                .get('/api/cart')
                .set('Cookie', [`token=${authToken}`])
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Cart fetched successfully');
            expect(Cart.findOne).toHaveBeenCalledWith({ userId: userId });
        });

        it('should return empty cart when no cart exists', async () => {
            Cart.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            const response = await request(app)
                .get('/api/cart')
                .set('Cookie', [`token=${authToken}`])
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Cart is empty');
            expect(response.body.cart.items).toEqual([]);
        });

        it('should return 401 when user is not authenticated', async () => {
            const response = await request(app)
                .get('/api/cart')
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Unauthorized');
        });
    });

    describe('POST /api/cart/add', () => {
        it('should add new item to cart successfully', async () => {
            const newItem = {
                productId: '64f8d5e2c123456789abcd01',
                quantity: 1,
                price: 25.99,
                image: 'test.jpg'
            };

            const mockCart = {
                userId: userId,
                items: [],
                subTotal: 0,
                save: jest.fn().mockResolvedValue(true)
            };

            Cart.findOne.mockResolvedValue(null);
            Cart.mockImplementation(() => mockCart);

            const response = await request(app)
                .post('/api/cart/add')
                .set('Cookie', [`token=${authToken}`])
                .send(newItem)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Item added to cart');
            expect(mockCart.save).toHaveBeenCalled();
        });

        it('should update quantity if item already exists in cart', async () => {
            const existingItem = {
                productId: '64f8d5e2c123456789abcd01',
                quantity: 2,
                price: 25.99,
                image: 'test.jpg'
            };

            const mockCart = {
                userId: userId,
                items: [{
                    productId: { toString: () => '64f8d5e2c123456789abcd01' },
                    quantity: 1,
                    price: 25.99,
                    total: 25.99
                }],
                subTotal: 25.99,
                save: jest.fn().mockResolvedValue(true)
            };

            Cart.findOne.mockResolvedValue(mockCart);

            const response = await request(app)
                .post('/api/cart/add')
                .set('Cookie', [`token=${authToken}`])
                .send(existingItem)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(mockCart.items[0].quantity).toBe(3); // 1 + 2
            expect(mockCart.save).toHaveBeenCalled();
        });

        it('should return 400 when required fields are missing', async () => {
            const invalidItem = {
                productId: '64f8d5e2c123456789abcd01',
                // missing quantity and price
            };

            const response = await request(app)
                .post('/api/cart/add')
                .set('Cookie', [`token=${authToken}`])
                .send(invalidItem)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Product ID, quantity, and price are required');
        });

        it('should return 400 when quantity or price are invalid', async () => {
            const invalidItem = {
                productId: '64f8d5e2c123456789abcd01',
                quantity: -1,
                price: 0
            };

            const response = await request(app)
                .post('/api/cart/add')
                .set('Cookie', [`token=${authToken}`])
                .send(invalidItem)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Quantity and price must be greater than 0');
        });
    });

    describe('DELETE /api/cart/remove/:productId', () => {
        it('should remove item from cart successfully', async () => {
            const productId = '64f8d5e2c123456789abcd01';
            const mockCart = {
                userId: userId,
                items: [
                    {
                        productId: { toString: () => productId },
                        quantity: 1,
                        total: 25.99
                    },
                    {
                        productId: { toString: () => '64f8d5e2c123456789abcd02' },
                        quantity: 2,
                        total: 51.98
                    }
                ],
                subTotal: 77.97,
                save: jest.fn().mockResolvedValue(true)
            };

            Cart.findOne.mockResolvedValue(mockCart);

            const response = await request(app)
                .delete(`/api/cart/remove/${productId}`)
                .set('Cookie', [`token=${authToken}`])
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Item removed from cart');
            expect(mockCart.items.length).toBe(1);
            expect(mockCart.save).toHaveBeenCalled();
        });

        it('should return 404 when cart is not found', async () => {
            Cart.findOne.mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/cart/remove/64f8d5e2c123456789abcd01')
                .set('Cookie', [`token=${authToken}`])
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Cart not found');
        });

        it('should return 404 when item is not in cart', async () => {
            const mockCart = {
                userId: userId,
                items: [{
                    productId: { toString: () => '64f8d5e2c123456789abcd02' },
                    quantity: 1,
                    total: 25.99
                }],
                save: jest.fn().mockResolvedValue(true)
            };

            Cart.findOne.mockResolvedValue(mockCart);

            const response = await request(app)
                .delete('/api/cart/remove/64f8d5e2c123456789abcd01')
                .set('Cookie', [`token=${authToken}`])
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Item not found in cart');
        });
    });

    describe('DELETE /api/cart/clear', () => {
        it('should clear cart successfully', async () => {
            const mockCart = {
                userId: userId,
                items: [],
                subTotal: 0
            };

            Cart.findOneAndUpdate.mockResolvedValue(mockCart);

            const response = await request(app)
                .delete('/api/cart/clear')
                .set('Cookie', [`token=${authToken}`])
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Cart cleared successfully');
            expect(Cart.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: userId },
                { items: [], subTotal: 0 },
                { new: true }
            );
        });

        it('should return 404 when cart is not found', async () => {
            Cart.findOneAndUpdate.mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/cart/clear')
                .set('Cookie', [`token=${authToken}`])
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Cart not found');
        });
    });

    describe('Error Handling', () => {
        it('should handle database errors gracefully', async () => {
            Cart.findOne.mockRejectedValue(new Error('Database connection failed'));

            const response = await request(app)
                .get('/api/cart')
                .set('Cookie', [`token=${authToken}`])
                .expect(500);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Error fetching cart');
        });
    });
});

// Frontend Cart Store Tests
describe('Cart Store Tests', () => {
    // Mock axios
    const mockAxios = {
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addToCart', () => {
        it('should add item to cart and update state', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    cart: {
                        items: [{ productId: '123', quantity: 1, price: 25.99 }],
                        subTotal: 25.99
                    }
                }
            };

            mockAxios.post.mockResolvedValue(mockResponse);

            // Test would depend on your actual store implementation
            // This is a template for testing Zustand store
        });
    });

    describe('removeFromCart', () => {
        it('should remove item from cart', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    cart: { items: [], subTotal: 0 }
                }
            };

            mockAxios.delete.mockResolvedValue(mockResponse);

            // Test implementation here
        });
    });

    describe('clearCart', () => {
        it('should clear entire cart', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    cart: { items: [], subTotal: 0 }
                }
            };

            mockAxios.delete.mockResolvedValue(mockResponse);

            // Test implementation here
        });
    });
});