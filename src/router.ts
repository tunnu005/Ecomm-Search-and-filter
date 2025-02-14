import { Router } from "express";
import { getFilteredProductsHandler, getProduct_attribues, getProduct_byCategory, getProduct_byStore, getProduct_bysubCategory, searching } from "./controller";


const router:Router = Router();


router.get('/search/:query/:page/:limit',searching)

router.get('/getproductbycategory/:category_id/:page/:limit',getProduct_byCategory)

router.get('/getproductbysubcategory/:subcategory_id/:page/:limit',getProduct_bysubCategory)

router.get('/getproductbystore/:store_id/:page/:limit',getProduct_byStore)

router.get('/getproductattributes/:productId',getProduct_attribues)

router.get('/getproductbyattribute',getFilteredProductsHandler)


export default router;