import Product from '../models/Product.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    const products = await Product.find(filter).lean();
    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) { res.status(404); throw new Error('Product not found'); }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};
