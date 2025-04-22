const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
res.json({
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
});
});

module.exports = router;