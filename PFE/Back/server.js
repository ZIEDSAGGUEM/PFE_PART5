const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
const http = require("http");
require("dotenv").config();
require("./connection");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
});

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const imageRoutes = require("./routes/imageRoutes");
const Story = require("./models/Story");
const User = require("./models/User");
const Product = require("./models/Product");
const paymentRoutes = require("./routes/PaymentOnline")

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/images", imageRoutes);
app.use("/api", paymentRoutes);

// Helper function to calculate discounted price
function calculateDiscountedPrice(product) {
  const discountPercentage = 25; // Adjust the discount percentage as needed
  const discountedPrice = product.price * (1 - discountPercentage / 100);

  // Limit the discounted price to three decimal places
  return parseFloat(discountedPrice.toFixed(3));
}

// Keep track of uploaded videos
const uploadedVideos = [];

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname + "-" + uniqueSuffix;
    uploadedVideos.push(filename);
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("video"), async (req, res) => {
  const videoPath = req.file.path;
  const { userId } = req.body;
  const { order } = req.body;

  try {
    const newStory = new Story({
      videoUrl: videoPath,
      createdBy: userId,
      order: order,
    });

    const savedStory = await newStory.save();

    res.json({ videoPath: savedStory.videoUrl, likes: savedStory.likes });
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement de la vidéo dans la base de données:",
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

app.use("/uploads", express.static("uploads"));

app.get("/videos", async (req, res) => {
  try {
    const sort = { _id: -1 };
    const videos = await Story.find({}, { __v: 0 }).sort(sort);

    res.json({ videos });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des vidéos depuis la base de données:",
      error
    );
  }
});

app.post("/video/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const video = await Story.findOne({ _id: id }).populate("order");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (video.membersLiked.includes(userId)) {
      return res.status(400).json({ message: "User already liked the video" });
    }

    video.likes += 1;
    video.membersLiked.push(userId);

    let discountApplied = false;

    if (video.likes > 100 && video.likes < 200 && video.order) {
      const productsIds = video.order.products;
      await Promise.all(
        Object.keys(productsIds).map(async (productId) => {
          if (productId.length > 7 && !discountApplied) {
            const product = await Product.findById(productId);
            if (product && !product.discountAppliedAt) {
              const discountedPrice = calculateDiscountedPrice(product);
              await Product.findByIdAndUpdate(
                productId,
                {
                  price: discountedPrice,
                  discountApplied: true,
                  discountAppliedAt: new Date(),
                },
                { new: true }
              );
              discountApplied = true;
            }
          }
        })
      );
    }

    await video.save();

    res.json({ video });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
app.post("/:storyId/verify", async (req, res) => {
  const { storyId } = req.params;
  const { verify } = req.body;

  try {
    // Update the verification status in the database
    const updatedStory = await Story.findByIdAndUpdate(
      { _id: storyId },
      { verify }
    );

    // Send a response indicating success
    res.json({ updatedStory });
  } catch (error) {
    console.error("Error verifying story:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/:videoId/delete", async (req, res) => {
  const videoId = req.params.videoId;

  try {
    // Find the video by ID and delete it
    const deletedVideo = await Story.findByIdAndDelete(videoId);

    if (deletedVideo) {
      res.json({ message: "Video deleted successfully", video: deletedVideo });
    } else {
      res.status(404).json({ error: "Video not found" });
    }
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/apply-discount", async (req, res) => {
  try {
    const stories = await Story.find().populate(" createdBy order");

    const discountPercentage = 20;

    await Promise.all(
      stories.map(async (story) => {
        if (story.likes > 50 && story.order) {
          const productIds = story.order.products;

          await Promise.all(
            productIds.map(async (productId) => {
              const product = await Product.findById(productId);
              if (product) {
                const discountedPrice =
                  product.price * (1 - discountPercentage / 100);
                await Product.findByIdAndUpdate(
                  productId,
                  { price: discountedPrice },
                  { new: true }
                );
              }
            })
          );
        }
      })
    );

    return res.json({ discountApplied: true });
  } catch (error) {
    console.error("Error applying discount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});






server.listen(8080, () => {
  console.log("server running at port", 8080);
});

app.set("socketio", io);
