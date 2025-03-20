import express from 'express';
import {isAdmin} from '../auth/authMiddleware.js';

import {
    getCats,
    getCatByName,
    getCatById,
    getCatItem,
    createCat,
    deleteCat
  } from '../controllers/catcontrollers.js';

const router = express.Router();


// Get requests
router.get('/', getCats);

router.get('/categoryName/:categoryName', getCatByName);

router.get('/catid/:catid', getCatById);

router.get('/:categoryName/item', getCatItem);

router.post('/', isAdmin, createCat);

router.post('/delete/', isAdmin, deleteCat);

export default router;