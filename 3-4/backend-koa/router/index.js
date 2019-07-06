const Router = require('koa-router');
const router = new Router();

const skillsCtrl = require('../controllers/skills');
const productsCtrl = require('../controllers/products');
const authCtrl = require('../controllers/auth.js');
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
    console.log('ctx.session', ctx.session);
    if (ctx.session.isAuth === true) {
        const msgskill = ctx.flash.get() ? ctx.flash.get().msgskill : null;
        const msgfile = ctx.flash.get() ? ctx.flash.get().msgfile : null;

        ctx.render('admin', {
            msgskill,
            msgfile
        });
    }
    else {
        ctx.redirect('/');
    }

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
    const msgslogin = ctx.flash.get() ? ctx.flash.get().msgslogin : null;

    ctx.render('login', {
        msgslogin
    });
});

router.post('/login', async(ctx) => {
    try {
        const authResult = await authCtrl.auth(ctx.request.body);
        if (authResult) {
            ctx.session.isAuth = true;
            ctx.redirect('/admin');
        }
        else {
            ctx.flash({msgslogin: 'Unautorized'});
            ctx.redirect('/login');
        }
    }
    catch (err) {
        console.error("err", err);
        err && err.message && ctx.flash.set({msgslogin: err.message});
        ctx.redirect('/login');
    }
});


module.exports = router;
