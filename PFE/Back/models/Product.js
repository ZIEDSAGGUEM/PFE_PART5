const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    description: {
      type: String,
      required: [true, "can't be blank"],
    },
    price: {
      type: Number,
      required: [true, "can't be blank"],
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, "can't be blank"],
    },
    pictures: {
      type: Array,
      required: true,
    },
    discountAppliedAt: {
      type: Date,
      default: null,
    },
  },
  { minimize: false }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
