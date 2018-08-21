var express = require('express');
var router = express.Router();

const User = require('./controllers/User');
const News = require('./controllers/News');


// User

router.post('/saveNewUser', async (req, res) => {
    try {
        const result = await User.saveNewUser(JSON.parse(req.text));
        res.json(result);
    }
    catch (err) {
        console.error("err", err);
        res.status(500).send('Internal error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const result = await User.login(JSON.parse(req.text));
        res.json(result);
    }
    catch (err) {
        console.error("err", err);
        res.status(500).send('Internal error');
    }
});

router.put('/updateUser/:id', async (req, res) => {
    try {
        const result = await User.updateUser({...JSON.parse(req.text), ...req.params});
        res.json(result);
    }
    catch (err) {
        console.error("err", err);
        res.status(500).send('Internal error');
    }
});

router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const result = await User.deleteUser(req.params);
        res.json(result);
    }
    catch (err) {
        console.error("err", err);
        res.status(500).send('Internal error');
    }
});

router.get('/getUsers', async (req, res) => {
    try {
        const result = await User.getUsers();
        res.json(result);
    }
    catch (err) {
        console.error("err", err);
        res.status(500).send('Internal error');
    }
});

router.put('/updateUserPermission/:id', async (req, res) => {
    try {
        const result = await User.updateUserPermission({...JSON.parse(req.text), ...req.params});
        res.json(result);
    }
    catch (err) {
        console.error("err", err);
        res.status(500).send('Internal error');
    }
});


// News

router.get('/getNews', async (req, res) => {
    try {
        const result = await News.getNews();
        res.json(result);
    }
    catch (err) {
        console.error("err", err);
        res.status(500).send('Internal error');
    }
});

router.post('/newNews', async (req, res) => {
    try {
        const result = await News.newNews(JSON.parse(req.text));
        res.json(result);
    }
    catch (err) {
        console.error("err", err);
        res.status(500).send('Internal error');
    }
});

router.put('/updateNews/:id', async (req, res) => {
    try {
        const result = await News.updateNews({...JSON.parse(req.text), ...req.params});
        res.json(result);
    }
    catch (err) {
        console.error("err", err);
        res.status(500).send('Internal error');
    }
});

router.delete('/deleteNews/:id', async (req, res) => {
    try {
        const result = await News.deleteNews(req.params);
        res.json(result);
    }
    catch (err) {
        console.error("err", err);
        res.status(500).send('Internal error');
    }
});





module.exports = router;
