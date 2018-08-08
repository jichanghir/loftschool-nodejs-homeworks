const Router = require('koa-router');
const router = new Router();

const skillsCtrl = require('../controllers/skills');
const productsCtrl = require('../controllers/products');
require('../errorHandler');

// index
router.get('/', async(ctx) => {
    try {
        const skills = await skillsCtrl.getSkills();
        const products = await productsCtrl.getProducts();

        ctx.render('index', {
            products,
            skills
        });
    }
    catch (err) {
        console.error("err", err);
        ctx.status = 404;
    }
});


// admin
router.get('/admin', async(ctx) => {
    console.log('ctx.flash.get()', ctx.flash.get());

    const msgskill = ctx.flash.get() ? ctx.flash.get().msgskill : null;
    const msgfile = ctx.flash.get() ? ctx.flash.get().msgfile : null;

    ctx.render('admin', {
        msgskill,
        msgfile
    });
});

router.post('/admin/skills', async(ctx) => {
    try {
        const setNewSkillResult = await skillsCtrl.setNewSkill(ctx.request.body);
        ctx.flash.set({msgskill: 'Added'});

        ctx.redirect('/admin');
    }
    catch (err) {
        console.error("err", err);
        err && err.message && ctx.flash.set({msgskill: err.message});
        ctx.redirect('/admin');
    }
});

router.post('/admin/upload', async(ctx) => {
    try {
        const uploadResult = await productsCtrl.uploadNewProduct({...ctx.request.files, ...ctx.request.body});
        ctx.flash.set({msgfile: 'Added'});

        ctx.redirect('/admin');
    }
    catch (err) {
        console.error("err", err);
        err && err.message && ctx.flash.set({msgfile: err.message});
        ctx.redirect('/admin');
    }
});


// login
router.get('/login', async(ctx) => {
    ctx.render('login');
});


module.exports = router;
