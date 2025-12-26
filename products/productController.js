const { uploadImageToCloudinary } = require("./imageUploader");
const Product = require("./productSchema");


// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    // validation can be added here
    if(!title || !description || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if(!req.files){
      return res.status(400).json({
        message: "Please provide a product image",
        success: false
      })
    }


    // upload images to cloudinary
    const imageUpload = await uploadImageToCloudinary(req.files.image , 'products');


    const product = new Product({ 
      title, 
      description, 
      price, 
      category, 
      images: [
        {
          secure_url: imageUpload.secure_url,
          public_id: imageUpload.public_id
        }
      ] 
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.updateProduct = async (req,res) => {

  try{

    const { title, description, price, category, product_id } = req.body;

    // validation can be added here
    if(!title || !description || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingProduct = await Product.findById(product_id);

    if(!existingProduct){
      return res.status(404).json({ error: "Product not found" });
    }

    existingProduct.title = title;
    existingProduct.description = description;
    existingProduct.price = price;
    existingProduct.category = category;

    await existingProduct.save();
    res.status(200).json(existingProduct);


  }catch(err){
    res.status(500).json({ error: err.message });
  }

}


// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};