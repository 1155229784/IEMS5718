

export function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

export function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin.compare(Buffer.from([1])) === 0) {
        next();
    } else {
        // res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
        res.redirect('/');
    }
}