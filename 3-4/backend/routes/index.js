const express = require('express');
const router = express.Router();

const mail = require('../controllers/mail');
const products = require('../controllers/products');
const skills = require('../controllers/skills');

router.get('/', async (req, res, next) => {
    let p = await products.getProducts();
    let s = await skills.getSkills();

    res.render('index', {
        title: 'Main',
        products: p,
        skills: s
    });
});

router.post('/', (req, res) => {
    mail.sendMail(req)
    .then((result) => {
        res.redirect('/');
    }, (errorObj) => {
        res.status(errorObj.code).redirect('/');
    })
    .catch((err) => {
        console.error(err);
        res.status(500).redirect('/');
    })
})


module.exports = router;
