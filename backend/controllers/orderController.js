const Order = require("../models/Order");
const Product = require("../models/Product");

// Generates a readable order ID like CN-8F3K2Q
const generateOrderId = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CN-${random}`;
};

// POST /api/orders
// Creates an order from the cart, checks stock, and reduces stock for each product.
const createOrder = async (req, res, next) => {
  try {
    const { products, shippingAddress } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required." });
    }

    // Verify stock and build order items from real DB data (never trust client-sent prices)
    const orderItems = [];
    let totalAmount = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock.` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
      product.stock -= item.quantity;
      await product.save();
    }

    const shippingCharge = totalAmount >= 500 ? 0 : 49;
    totalAmount += shippingCharge;

    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + 5);

    const order = await Order.create({
      orderId: generateOrderId(),
      user: req.user._id,
      products: orderItems,
      totalAmount,
      shippingAddress,
      expectedDelivery,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders
// Buyers see only their own orders. Sellers see every order.
const getOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === "seller" ? {} : { user: req.user._id };
    const orders = await Order.find(filter)
      .populate("user", "phone")
      .sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
// :id can be either the Mongo _id or the human-readable orderId (used for order tracking).
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { orderId: id.toUpperCase() };

    const order = await Order.findOne(query).populate("user", "phone");

    if (!order) {
      return res.status(404).json({ message: "No order found with that Order ID." });
    }

    // Buyers may only view their own orders
    if (req.user.role !== "seller" && String(order.user._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "You don't have access to this order." });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status (seller only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = Order.STATUSES;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
