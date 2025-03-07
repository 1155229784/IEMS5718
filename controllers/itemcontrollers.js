
import mysql from 'mysql2';
import pool from '../databasecon.js';


// @desc    Get Item by id
// @route   GET /api/item/:id
export const getItem = async (req, res, next) => {
    try {
        const id= req.params.id;
        const [item] = await pool.promise().query('SELECT * FROM products WHERE pid = ?', [id]);
        // console.log(item)
        res.json(item);
      } catch (err) {
        next(err);
      }
  };




// @desc    create Item by name
// @route   POST /api/item/
export const createItem = async (req, res, next) => {
  try {

      const categoryName = req.body.category_select;
      const [category] = await pool.promise().query('SELECT * FROM categories WHERE name = ?', [categoryName]);
      const [items] = await pool.promise().query('SELECT MAX(pid) AS max_pid FROM products');

      const newItem = {
        pid: items[0].max_pid + 1 || 1, 
        name: req.body.productname,
        catid: category[0].catid,
        price: req.body.price,
        description: req.body.description,
        imagepath: req.file_name ,
      }

      const [result] = await pool.promise().query(
        'INSERT INTO products (pid, name, catid, price, description, imagepath) VALUES (?, ?, ?, ?, ?, ?)', 
        [newItem.pid, newItem.name, newItem.catid, newItem.price, newItem.description, newItem.imagepath]
      );
      // console.log(item)
      res.json(result);
    } catch (err) {
      next(err);
    }
};


// @desc    delete Item by name
// @route   DELETE /api/item/:itemName
export const deleteItem = async (req, res, next) => {

  try {
    const item_id = req.body.product_id;

    if (!item_id ) {
      const error = new Error(`provide a valid item id`);
      error.status = 404;
      return next(error);
    }

    const [result] = await pool.promise().query(
      'DELETE FROM products WHERE pid = ?', 
      [item_id]
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }

};