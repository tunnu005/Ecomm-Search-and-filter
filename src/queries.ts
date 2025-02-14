import { pool } from "./dbconnection";

interface product {
    product_id: number,
    storefront_id: number,
    name: string,
    description: string,
    price: number,
    image: string,
    category_id: number,
    created_at: Date,

}

interface attribute{
    name:string,
    value:string
}
export const searchProduct = async (textquery: string, page: number, limit: number): Promise<product[] | []> => {

    const offset = (page - 1) * limit;
    try {
        const query = `SELECT * 
    FROM public.product 
    WHERE to_tsvector('english', name || ' ' || description) 
    @@ plainto_tsquery($1)
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;`

        const result = await pool.query(query, [textquery, limit, offset]);
        return result.rows;
    } catch (error) {
        console.error(error);
        throw new Error('Error searching for products');
    }
}

export const getProductbycategory = async (category_id: number, page: number, limit: number): Promise<product[] | []> => {

    const offset = (page - 1) * limit;
    try {
        const query = `SELECT * FROM product WHERE category_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;`
        const result = await pool.query(query, [category_id, limit, offset]);
        return result.rows;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching products by category');
    }
}

export const getProductbysubcategory = async (subcategory_id: number, page: number, limit: number): Promise<product[] | []> => {
    const offset = (page - 1) * limit;
    try {
        const query = `SELECT * FROM product WHERE subcategory_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`
        const result = await pool.query(query, [subcategory_id, limit, offset])
        return result.rows;
    } catch (error) {
        console.error(error)
        throw new Error("Error fetching product by subcategory")
    }
}

export const getProductByStore = async (storefront_id: number, page: number, limit: number): Promise<product[] | []> => {
    const offset = (page - 1) * limit;
    try {
        const query = `SELECT * FROM product where storefront_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`
        const result = await pool.query(query, [storefront_id, limit, offset])
        return result.rows;
    } catch (error) {
        console.error(error)
        throw new Error("Error fetching product by store")
    }
}

export const getProductAttributes = async (product_id: number):Promise<attribute[] |[]> => {
    try {
        const query = `
            SELECT a.name as name, v.value as value
            FROM "product" p
            JOIN "product_attribute" pa ON pa.product_id = p.product_id
            JOIN "attribute" a ON a.attribute_id = pa.attribute_id
            JOIN "value" v ON v.value_id = pa.value_id;
        `

        const result = await pool.query(query, [product_id]);
        return result.rows;
    } catch (error) {
        console.error(error)
        throw new Error("Error fetching product attributes")
    }
}


export const getFilteredProducts = async (filters: { attributeId: number, valueId: number }[]):Promise<product[] | [] > => {
    const values: any[] = [];
    let whereClause = "";
    
    filters.forEach((filter, index) => {
      whereClause += `(pa.attribute_id = $${values.length + 1} AND pa.value_id = $${values.length + 2}) OR `;
      values.push(filter.attributeId, filter.valueId);
    });
  
    whereClause = whereClause.slice(0, -4); 
  
    const sql = `
      SELECT p.*
      FROM product p
      JOIN product_attributes pa ON p.product_id = pa.product_id
      WHERE ${whereClause}
      GROUP BY p.product_id
      HAVING COUNT(DISTINCT pa.attribute_id) = $${values.length + 1}
      ORDER BY p.created_at DESC;
    `;
  
    values.push(filters.length); 
  
    const result = await pool.query(sql, values);
    return result.rows;
  };
  
