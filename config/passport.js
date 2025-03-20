
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { validPassword } from '../lib/passwordUtil.js';
import pool from '../databasecon.js';

const customFields = {
    usernameField: 'uname',
    passwordField: 'pw'
};


const verifyCallback = async (username, password, done) => {
    try {
        // Query to find user by username
        const [rows] = await pool.promise().query(
            'SELECT * FROM users WHERE username = ?', 
            [username]
        );

        // If no user found
        if (rows.length === 0) {
            return done(null, false);
        }

        const user = rows[0];
        // console.log('user:' , user)
        // Validate password
        const isValid = validPassword(password, user.hash, user.salt);
        
        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err);
    }
}


const Strategy = new LocalStrategy(customFields,verifyCallback);

passport.use(Strategy);

// Serialization methods
passport.serializeUser((user, done) => {
    done(null, user.uid);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await await pool.promise().query(
            'SELECT * FROM users WHERE uid = ?', 
            [id]
        );

        if (rows.length > 0) {
            done(null, rows[0]);
        } else {
            done(new Error('User not found'));
        }
    } catch (err) {
        done(err);
    }
});


export default passport;