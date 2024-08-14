// const { Product } = require("../model/product");

// exports.createProduct = async (req, res) => {
//   // this product we have to get from API body
//   const product = new Product(req.body);
//   product.discountPrice = Math.round(
//     product.price * (1 - product.discountPercentage / 100)
//   );
//   try {
//     const doc = await product.save();
//     res.status(201).json(doc);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// exports.fetchAllProducts = async (req, res) => {
//   let condition = {};
//   if (!req.query.admin) {
//     condition.deleted = { $ne: true };
//   }

//   let query = Product.find(condition);
//   let totalProductsQuery = Product.find(condition);

//   if (req.query.category) {
//     query = query.find({ category: { $in: req.query.category.split(",") } });
//     totalProductsQuery = totalProductsQuery.find({
//       category: { $in: req.query.category.split(",") },
//     });
//   }
//   if (req.query.brand) {
//     query = query.find({ brand: { $in: req.query.brand.split(",") } });
//     totalProductsQuery = totalProductsQuery.find({
//       brand: { $in: req.query.brand.split(",") },
//     });
//   }
//   //TODO : How to get sort on discounted Price not on Actual price
//   if (req.query._sort && req.query._order) {
//     query = query.sort({ [req.query._sort]: req.query._order });
//   }

//   const totalDocs = await totalProductsQuery.count().exec();
//   console.log({ totalDocs });

//   if (req.query._page && req.query._limit) {
//     const pageSize = req.query._limit;
//     const page = req.query._page;
//     query = query.skip(pageSize * (page - 1)).limit(pageSize);
//   }

//   try {
//     const docs = await query.exec();
//     res.set("X-Total-Count", totalDocs);
//     res.status(200).json(docs);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// exports.fetchProductById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const product = await Product.findById(id);
//     res.status(200).json(product);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// exports.updateProduct = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const product = await Product.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     product.discountPrice = Math.round(
//       product.price * (1 - product.discountPercentage / 100)
//     );
//     const updatedProduct = await product.save();
//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

const { Product } = require("../model/product");
const path = require("path");

exports.createProduct = async (req, res) => {
  const { files, body } = req;
  const productData = { ...body };
  // Initialize the images array
  productData.images = [];
  // Assign file paths to the product data
  if (files) {
    if (files.image1) productData.images.push(files.image1[0].path); // Store image1 path
    if (files.image2) productData.images.push(files.image2[0].path); // Store image2 path
    if (files.image3) productData.images.push(files.image3[0].path);
    if (files.thumbnail) productData.thumbnail = files.thumbnail[0].path;
  }

  const product = new Product(productData);
  console.log(product);
  product.discountPrice = Math.round(
    product.price * (1 - product.discountPercentage / 100)
  );

  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: { $in: req.query.category.split(",") } });
    totalProductsQuery = totalProductsQuery.find({
      category: { $in: req.query.category.split(",") },
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: { $in: req.query.brand.split(",") } });
    totalProductsQuery = totalProductsQuery.find({
      brand: { $in: req.query.brand.split(",") },
    });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { files, body } = req;
  const updatedData = { ...body };

  // Assign new file paths to the updated data
  if (files) {
    if (files.image1) productData.image1 = files.image1[0].path;
    if (files.image2) productData.image2 = files.image2[0].path;
    if (files.image3) productData.image3 = files.image3[0].path;
    if (files.thumbnail) updatedData.thumbnail = files.thumbnail[0].path;
  }

  try {
    const product = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};
