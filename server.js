import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import catrouter from './routes/catrouter.js';
import itemrouter from './routes/itemrouter.js';

const app = express();
const port = process.env.PORT || 3030;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));






// setup static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/category')));
// app.use(express.static(path.join(__dirname, 'public/shoppingcart')));
app.use(express.static(path.join(__dirname, 'utill')));
app.use(express.static(path.join(__dirname, 'productimg')));
app.use(express.static(path.join(__dirname, 'admin')));




// Routes
app.use('/api/category', catrouter);
app.use('/api/item', itemrouter);

app.get('/category/:categoryName', (req, res) => {
    // Serve the category.html file for any category route
    res.sendFile(path.join(__dirname, 'public/category/category.html'));
});


app.get('/category/:categoryName', (req, res) => {
    // Serve the category.html file for any category route
    res.sendFile(path.join(__dirname, 'public/category/category.html'));
});


app.get('/product/:pid', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/product/product.html'));
});

app.get('/public/shoppingcart/shoppingcart.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/shoppingcart/shoppingcart.html'));
});

app.get('/admin/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/admin.html'));
});

// app.use('/api/item', catrouter);
  

app.listen(port, () => {
    console.log(`server is running on ${port}`); 

});
// app.listen(process.env.PORT || 3000, () => console.log('App avaliable on https://localhost:3000'))