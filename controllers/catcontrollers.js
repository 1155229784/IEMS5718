import mysql from 'mysql2';
import pool from '../databasecon.js';


// pool.getConnection(function(err, connection) {
//     if (err) 
//         {
//           connection.release();
//           throw err;
//         }
//         else
//         {
//             connection.query( 'SELECT * FROM categories', function(err, rows) {
//                 console.log(rows);
//                 connection.release();
//             });
//         }
// });

// @desc   Get all cat
// @route  GET /api/category
export const getCats = async (req, res, next) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM categories');
        res.json(rows);
      } catch (err) {
        next(err);
      }
};


// @desc    Get single cat
// @route   GET /api/category/:categoryName
export const getCatByName = async (req, res, next) => {
    try {
        const categoryName = req.params.categoryName;
        
        const [rows] = await pool.promise().query('SELECT * FROM categories WHERE name = ?', [categoryName]);
        // console.log(rows[0])
        res.json(rows);
      } catch (err) {
        next(err);
      }
};


// @desc    Get single cat
// @route   GET /api/category/:catid
export const getCatById = async (req, res, next) => {
  try {
      const catid = req.params.catid;
      
      const [rows] = await pool.promise().query('SELECT * FROM categories WHERE catid = ?', [catid]);
      // console.log(rows)
      res.json(rows);
    } catch (err) {
      next(err);
    }
};


// @desc    Get all item under category
// @route   GET /api/category/:categoryName/item
export const getCatItem = async (req, res, next) => {
  try {
      const categoryName = req.params.categoryName;

      const [category] = await pool.promise().query('SELECT * FROM categories WHERE name = ?', [categoryName]);
      const [rows] = await pool.promise().query('SELECT * FROM products WHERE catid = ?', [category[0].catid]);
      // console.log(rows)
      res.json(rows);
    } catch (err) {
      next(err);
    }
}; 


// @desc    Create new cat
// @route   POST /api/category
export const createCat = async (req, res, next) => {
  const [category] = await pool.promise().query('SELECT * FROM categories');
  console.log(req)
  const newCat = {
    catid: category.length + 1,
    name: req.body.category_name,
  }

  if (!newCat.name) {
    const error = new Error(`Please include a name`);
    error.status = 400;
    return next(error);
  }

  const [result] = await pool.promise().query(
    'INSERT INTO categories (catid, name) VALUES (?, ?)', 
    [newCat.catid, newCat.name]
  );

  res.status(201).json(result);
};


// @desc    Delete cat
// @route   POST /api/delete/
export const deleteCat = async (req, res, next) => {
  const categoryName = req.body.category_select;

  if (!categoryName) {
    const error = new Error(`provide a valid catname`);
    error.status = 404;
    return next(error);
  }

  const [result] = await pool.promise().query(
    'DELETE FROM categories WHERE name = ?', 
    [categoryName]
  );
  res.status(200).json(result);
};