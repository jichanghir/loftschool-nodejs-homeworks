const express = require('express');
const router = express.Router();

const skills = require('../controllers/skills');
const products = require('../controllers/products');

router.get('/', function(req, res, next) {
    if (!req.session.isAuth) {
        res.redirect('/');
    }

    res.render('admin', {
        title: 'Admin',
        msgskill: req.flash('msgskill'),
        msgfile: req.flash('msgfile')
    });
});

router.post('/skills', (req, res) => {
    skills.setNewSkill(req)
    .then((result) => {
        req.flash('msgskill', 'Added');
        res.redirect('/admin');
    }, (errorObj) => {
        res.status(errorObj.code).redirect('/admin');
    })
    .catch((err) => {
        console.error(err);
        res.status(500).redirect('/');
    });
});

router.post('/upload', (req, res) => {
    products.uploadNewProduct(req)
    .then((result) => {
        req.flash('msgfile', 'Added');
        res.redirect('/admin');
    }, (errorObj) => {
        res.status(errorObj.code).redirect('/admin');
    })
    .catch((err) => {
        console.error(err);
        res.status(500).redirect('/');
    });
});


module.exports = router;
