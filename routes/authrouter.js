import express from 'express';
import passport from '../config/passport.js';
import { genPassword, validPassword } from '../lib/passwordUtil.js';
import pool from '../databasecon.js';

const router = express.Router();


router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/' }));

router.post('/register', async (req, res, next) => {
    try {
        const saltHash = genPassword(req.body.pw);
        
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        // Insert new user into the database
        const result = await pool.promise().query(
            'INSERT INTO users (username, hash, salt, admin) VALUES (?, ?, ?, ?)',
            [req.body.uname, hash, salt, false]
        );

        // console.log({
        //     id: result.insertId,
        //     username: req.body.uname,
        // });

        // Redirect to login page
        res.redirect('/login');

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Registration failed');
    }
 });


 router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { 
            return next(err); 
        }
        res.redirect('/');
    });
});


router.get('/login_stat', (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            res.json(req.user.username);
        } else {
            res.json('guest');
        }
    } catch (err) {
        next(err);
    }
});


router.post('/change_password', (req, res, next) => {
    // Ensure user is authenticated
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'You must be logged in to change password' });
    }

    const old_password = req.body.pw
    const new_password = req.body.new_pw
    // Validate input
    if (!old_password || !new_password) {
        return res.status(400).json({ message: 'Both old and new passwords are required' });
    }

    // Verify old password
    const isValidPassword = validPassword(old_password, req.user.hash, req.user.salt);

    if (!isValidPassword) {
        return res.redirect('/login-failure');;
    }

    // Generate new salt and hash
    const saltHash = genPassword(new_password);
    const newSalt = saltHash.salt;
    const newHash = saltHash.hash;

    // Update password in database
    pool.promise().query(
        'UPDATE users SET hash = ?, salt = ? WHERE uid = ?',
        [newHash, newSalt, req.user.uid]
    )
    .then(() => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
            }
            res.redirect('/login');
        });
    })
    .catch((error) => {
        console.error('Password change error:', error);
        res.status(500).json({ message: 'Failed to update password' });
    });
});


export default router;