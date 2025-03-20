import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import {isAdmin} from '../auth/authMiddleware.js';

import {
  getItem,
  createItem,
  deleteItem
} from '../controllers/itemcontrollers.js';

const router = express.Router();



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'productimg')
    },
    
    filename: (req, file, cb) => {
      const unique_filename = Date.now() + file.originalname;
        // Attach the filename to the request object
        req.file_name = unique_filename;
        cb(null, unique_filename)
    }
})
const upload = multer({storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Optional: limit file size to 5MB
}).single("imageToUpload");


const createThumbnail = async (input_path, output_path) => {
  try {
      await sharp(input_path)
          .resize({
              width: 100,  // define width and height
              height: 100, 
              // fit: sharp.fit.cover, // crop to cover
              // position: sharp.strategy.attention // smart cropping
          })
          .toFile(output_path);
      return true;
  } catch (error) {
      console.error('Thumbnail creation error:', error);
      return false;
  }
};



// Get requests
router.get('/:id', getItem);


//Post requests

// router.post('/', createItem);
router.post('/', isAdmin, async (req, res, next) => {
  upload(req, res,  async (err) => {
      // Construct the absolute path to productimg folder
      const product_image_folder = path.join(process.cwd(), 'productimg');
      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
      }
      if (err instanceof multer.MulterError) {
          return res.status(500).json({ error: err.message });
      } else if (err) {
          return res.status(500).json({ error: err.message });
      }
       // Full image path
       const full_image_path = path.join(product_image_folder, req.file_name);
        
       // Thumbnail path
       const thumbnail_Path = path.join(product_image_folder, 'thumb_' + req.file_name);

       // Create thumbnail
      const thumbnail_created = await createThumbnail(
        full_image_path, 
        thumbnail_Path
      );

      if (!thumbnail_created) {
        return res.status(500).json({ error: 'Failed to create thumbnail' });
    }
      // if (req.file) {
      //   req.uploaded_file_name = req.file.originalname;
        // req.uploaded_file_path = req.file.path;
      // }
      
      createItem(req, res, next);
  });
});
// router.post('/', upload.single("imageToUpload"), createItem);



//Delete requests
router.post('/delete', isAdmin, deleteItem);


export default router;