const router = require("express").Router();
const Order = require("../models/Orders");
const Product = require("../models/Product");
const User = require("../models/User");

router.post("/place-cod-order", async (req, res) => {
  const io = req.app.get("socketio");
  const { userId, cart, phone, address } = req.body;

  try {
    const user = await User.findById(userId);

    // Modify the order creation to include the payment method (COD)
    const order = await Order.create({
      owner: user._id,
      products: cart,
      phone,
      address,
      paymentMethod: "COD", // Set the payment method to COD
    });

    order.count = cart.count;
    order.total = cart.total - 8;
    await order.save();

   

    // Update product quantities in stock
    for (const productId in cart) {
      if (
        cart.hasOwnProperty(productId) &&
        productId !== "total" &&
        productId !== "count"
      ) {
        const product = await Product.findById(productId);

        if (product) {
          // Ensure there's enough stock before updating
          if (product.countInStock >= cart[productId]) {
            product.countInStock -= cart[productId];
            await product.save();
          } else {
            // If insufficient stock, handle accordingly (e.g., return an error)
            return res
              .status(400)
              .json({ error: `Insufficient stock for product ${productId}` });
          }
        } else {
          // Handle case where the product is not found
          return res
            .status(404)
            .json({ error: `Product ${productId} not found` });
        }
      }
    }

    // Clear the user's cart
    user.cart = { total: 0, count: 0 };
    user.address = address
    user.phone = phone
    // Add the order to the user's order history
    user.orders.push(order);

    // Notify through WebSocket about the new order
    const notification = {
      status: "unread",
      message: `New order from ${user.name}`,
      time: new Date(),
    };
    io.sockets.emit("new-order", notification);

    // Save the modified user object
    user.markModified("orders");
    await user.save();
    console.log(user);
    res.status(200).json(user);
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
  }
});

router.post("/Online_Payment", async (req, res) => {
  const io = req.app.get("socketio");
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    const cart = user.cart
    // Modify the order creation to include the payment method (COD)
    const order = await Order.create({
      owner: user._id,
      products: user.cart,
      phone:user.phone,
      address:user.address,
      paymentMethod: "Online", // Set the payment method to Online
    });

    order.count = user.cart.count;
    order.total = user.cart.total 
    await order.save();

   

    // Update product quantities in stock
    for (const productId in cart) {
      if (
        cart.hasOwnProperty(productId) &&
        productId !== "total" &&
        productId !== "count"
      ) {
        const product = await Product.findById(productId);

        if (product) {
          // Ensure there's enough stock before updating
          if (product.countInStock >= cart[productId]) {
            product.countInStock -= cart[productId];
            await product.save();
          } else {
            // If insufficient stock, handle accordingly (e.g., return an error)
            return res
              .status(400)
              .json({ error: `Insufficient stock for product ${productId}` });
          }
        } else {
          // Handle case where the product is not found
          return res
            .status(404)
            .json({ error: `Product ${productId} not found` });
        }
      }
    }

    // Clear the user's cart
    user.cart = { total: 0, count: 0 };
  
    // Add the order to the user's order history
    user.orders.push(order);

    // Notify through WebSocket about the new order
    const notification = {
      status: "unread",
      message: `New order from ${user.name}`,
      time: new Date(),
    };
    io.sockets.emit("new-order", notification);

    // Save the modified user object
    user.markModified("orders");
    await user.save();
    console.log(user);
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to process the order. Please try again.' });
  
  }
});


router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("owner", ["email", "name"]);
    res.status(200).json(orders);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

router.patch("/:id/mark-shipped", async (req, res) => {
  const io = req.app.get("socketio");
  const { ownerId } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findById(ownerId);
    await Order.findByIdAndUpdate(id, { status: "Commande Confirmé" });
    const orders = await Order.find().populate("owner", ["email", "name"]);
    const notification = {
      status: "unread",
      message: `Order ${id} shipped with success`,
      time: new Date(),
    };
    io.sockets.emit("notification", notification, ownerId);
    user.notifications.push(notification);
    await user.save();
    res.status(200).json(orders);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

module.exports = router;
