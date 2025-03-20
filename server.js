import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session  from 'express-session';
import crypto from 'crypto';
import MySQLSession from 'express-mysql-session';

import pool from './databasecon.js';
import catrouter from './routes/catrouter.js';
import itemrouter from './routes/itemrouter.js';
import authrouter from './routes/authrouter.js'
import passport from 'passport';'./config/passport.js';
import {isAdmin,isAuth} from './auth/authMiddleware.js';
import helmet from 'helmet';


const app = express();


const port = process.env.PORT || 3030;


const MySQLStore = MySQLSession(session);
const sessionStore = new MySQLStore({}/* session store options */, pool);


// const allowedOrigins = [
//     'http://localhost:3030',  // Local development
//     'http://172.207.78.253', // Production domain
// ];

// const originMiddleware = (req, res, next) => {
//     const origin = req.get('origin');
    
//     if (allowedOrigins.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//         res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//         res.setHeader('Access-Control-Allow-Credentials', 'true');
//     }
//     next();
// };

// app.use(originMiddleware);

const nonceMiddleware = (req, res, next) => {

    const nonce = crypto.randomBytes(16).toString('base64');
    
    res.locals.nonce = nonce;
    const sanitizedNonce = nonce.replace(/[^\w\d+/=]/g, '');
    try {
      // Use helmet for more robust CSP header setting
      res.setHeader('Content-Security-Policy', 
        `default-src 'self'; ` +
        `script-src 'self' 'nonce-${sanitizedNonce}' 'strict-dynamic'; ` +
        `script-src-elem 'self'; ` +
        `style-src 'self' 'nonce-${sanitizedNonce}'; ` +
        `img-src 'self' data:; ` +
        `connect-src 'self'; ` +
        `object-src 'none'; ` +
        `base-uri 'self';`
      );
    } catch (error) {
      console.error('Error setting CSP header:', error);
    }
  
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  
    next();
  };



app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        sameSite: 'strict' // Provides protection against CSRF
    },
    name: '5718projectcookie',
    rolling: true, // Reset the cookie expiration on every request
    genid: function(req) {
        return crypto.randomBytes(32).toString('hex'); // Generate a unique session ID
    }
}));


app.use(nonceMiddleware);

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
})

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
app.use(express.static(path.join(__dirname, 'auth')));


// Routes
app.use('/api/category', catrouter);
app.use('/api/item', itemrouter);
app.use(authrouter);

// Modify sendFile to inject nonce
function sendFileWithNonce(res, filePath) {
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(500).send('Error loading file');
      }
    });
  }



//serve static pages


app.get('/', (req, res) => {
    // Serve the category.html file for any category route
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


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

app.get('/admin/', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/admin.html'));
});


app.get('/login/', (req, res) => {
    res.sendFile(path.join(__dirname, 'auth/login.html'));
});

app.get('/register/', (req, res) => {
    res.sendFile(path.join(__dirname, 'auth/register.html'));
});

app.get('/user_page', isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/user/user_page.html'));
});


// app.use('/api/item', catrouter);
app.get('/login-failure', (req, res) => {
    res.sendFile(path.join(__dirname, 'auth/login_failure.html'));
});

// app.get('/login-success', (req, res) => {
//     res.sendFile(path.join(__dirname, 'auth/login_success.html'));
// });
app.listen(port, () => {
    console.log(`server is running on ${port}`); 

});