// const express = require("express");
// const {
//   createProduct,
//   fetchAllProducts,
//   fetchProductById,
//   updateProduct,
// } = require("../controller/Product");

// const router = express.Router();
// //  /products is already added in base path
// router
//   .post("/", createProduct)
//   .get("/", fetchAllProducts)
//   .get("/:id", fetchProductById)
//   .patch("/:id", updateProduct);

// exports.router = router;
// backend/routes/productRoutes.js

const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} = require("../controller/Product");
const multer = require("multer");
const path = require("path");

// Set up storage engine for multer
const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only Images are allowedd"));
  }
};
// Initialize multer with the storage engine
const upload = multer({ storage: imgconfig, fileFilter: isImage });

const router = express.Router();

// Define routes with multer middleware
router
  .post(
    "/",
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    createProduct
  )
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductById)
  .patch(
    "/:id",
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 }, // Only one thumbnail is allowed

      updateProduct,
    ])
  );

exports.router = router;
