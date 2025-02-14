import { Request, RequestHandler, Response, } from "express";
import { getFilteredProducts, getProductAttributes, getProductbycategory, getProductByStore, getProductbysubcategory, searchProduct } from "./queries";


export const searching: RequestHandler = async (req: Request, res: Response) => {

    const query = req.params.query
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    try {
        // Call your search function to retrieve products
        const products = await searchProduct(query, page, limit);

        // Send the results back to the client
        res.json({
            success: true,
            data: products,
            page,
            limit,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching products' });
    }
};


export const getProduct_byCategory: RequestHandler = async (req: Request, res: Response) =>{

    const categoryId = parseInt(req.params.categoryId);
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    
    try {
        const products = await getProductbycategory(categoryId, page, limit);
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"error fetching product by category"})
    }
}

export const getProduct_bysubCategory: RequestHandler = async (req: Request, res: Response) =>{

    const subcategoryId = parseInt(req.params.subcategoryId);
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    
    try {
        const products = await getProductbysubcategory(subcategoryId, page, limit);
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"error fetching product by category"})
    }
}

export const getProduct_byStore: RequestHandler = async (req: Request, res: Response) =>{

    const storeId = parseInt(req.params.categoryId);
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    
    try {
        const products = await getProductbycategory(storeId, page, limit);
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"error fetching product by category"})
    }
}


export const getProduct_attribues: RequestHandler = async (req: Request, res: Response) =>{
    const productId = parseInt(req.params.productId);
    try {
        const product = await getProductAttributes(productId)
        res.json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Error getting attributes"})
    }
}

export const getFilteredProductsHandler:RequestHandler = async (req: Request, res: Response) => {
    try {
      const filters = req.body.filters; // [{ attributeId: 1, valueId: 10 }, { attributeId: 2, valueId: 20 }]
      
      if (!filters || filters.length === 0) {
        res.status(400).json({ error: "At least one filter is required" });
        return
      }
  
      const products = await getFilteredProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };


