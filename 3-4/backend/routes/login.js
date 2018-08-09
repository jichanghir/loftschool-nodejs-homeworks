const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');

router.get('/', function(req, res, next) {
  res.render('login', {title: 'Login'})
});

router.post('/', (req, res) => {
    auth.auth(req)
    .then((result) => {
        req.session.isAuth = true;
        res.redirect('/admin');
    }, (errorObj) => {
        res.status(errorObj.code).redirect('/login');
    })
    .catch((err) => {
        console.error(err);
        res.status(500).redirect('/login');
    })
});

module.exports = router;
