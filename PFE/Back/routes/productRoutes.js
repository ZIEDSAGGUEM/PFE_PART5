const router = require("express").Router();
const Product = require("../models/Product");
const User = require("../models/User");

//get products;
router.get("/", async (req, res) => {
  try {
    const sort = { _id: -1 };
    const products = await Product.find().sort(sort);
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/get-favorites/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Find the user and populate the favorites array with product details
    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract relevant information from populated favorites
    const favoritesWithDetails = user.favorites.map((favorite) => ({
      _id: favorite._id,
      name: favorite.name,
      price: favorite.price,
      picture: favorite.pictures,
      // Add any other fields you want to include
    }));

    res.status(200).json(favoritesWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/filter", async (req, res) => {
  const { maxPrice } = req.query;

  try {
    let filter = {};

    if (maxPrice) {
      filter.price = { $lte: parseInt(maxPrice) };
    }

    const filteredProducts = await Product.find(filter);
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//create product
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      countInStock,
      category,
      images: pictures,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      countInStock,
      category,
      pictures,
    });

    console.log(product);
    const products = await Product.find();
    res.status(201).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// update product

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const {
      name,
      description,
      price,
      countInStock,
      category,
      images: pictures,
    } = req.body;
    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      countInStock,
      category,
      pictures,
    });
    const products = await Product.find();
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// delete product

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user.isAdmin) return res.status(401).json("You don't have permission");
    await Product.findByIdAndDelete(id);
    const products = await Product.find();
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    const similar = await Product.find({ category: product.category }).limit(5);
    res.status(200).json({ product, similar });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    let products;
    const sort = { _id: -1 };
    if (category == "all") {
      products = await Product.find().sort(sort);
    } else {
      products = await Product.find({ category }).sort(sort);
    }
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// add-to-favorites
router.post("/add-to-favorites", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the product is not already in favorites
    if (!user.favorites) {
      user.favorites = [];
    }

    const existingFavorite = user.favorites.find((fav) =>
      fav.equals(productId)
    );

    if (!existingFavorite) {
      user.favorites.push(productId);
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Remove from favorites
router.post("/remove-from-favorites", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Update the user by pulling the specified product from favorites array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: productId } },
      { new: true } // Return the modified document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(updatedUser);
    res.status(200).json(updatedUser.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// cart routes

router.post("/add-to-cart", async (req, res) => {
  const { userId, productId, price } = req.body;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    const userCart = user.cart;
    if (user.cart[productId]) {
      if (user.cart[productId] + 1 > product.countInStock) {
        return res.status(400).json({ error: "Exceeds countInStock limit" });
      }
      userCart[productId] += 1;
    } else {
      userCart[productId] = 1;
    }
    userCart.count += 1;
    userCart.total = Number(userCart.total) + Number(price);
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/increase-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (user.cart[productId] + 1 > product.countInStock) {
      return res.status(400).json({ error: "Exceeds countInStock limit" });
    }

    const userCart = user.cart;
    userCart.total += Number(price);
    userCart.count += 1;
    userCart[productId] += 1;
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/decrease-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;

    if (userCart[productId] === 1) {
      // If the quantity is 1, remove the product from the cart
      delete userCart[productId];
    } else if (userCart[productId] > 1) {
      // If the quantity is more than 1, decrease the quantity
      userCart[productId] -= 1;
    }
    userCart.total -= Number(price);
    userCart.count -= 1;
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/remove-from-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.total -= Number(userCart[productId]) * Number(price);
    userCart.count -= userCart[productId];
    delete userCart[productId];
    user.cart = userCart;
    user.markModified("cart");
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
