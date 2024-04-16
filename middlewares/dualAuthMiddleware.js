const passport = require('../utils/passport');

exports.authenticateDualStrategy = function(req, res, next) {
    passport.authenticate('jwt-user', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (user) {
            req.user = user;
            return next();
        }
        passport.authenticate('jwt-employee', { session: false }, (err, employee, info) => {
            if (err) {
                return next(err);
            }
            if (employee) {
                req.user = employee;
                return next();
            }
            return res.status(401).json({ message: "Unauthorized" });
        })(req, res, next);
    })(req, res, next);
};
