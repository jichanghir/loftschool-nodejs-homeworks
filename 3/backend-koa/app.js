const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const Pug = require('koa-pug')
const pug = new Pug({
    viewPath: './views/pages',
    basedir: './views/pages',
    pretty: true,
    noCache: true,
    app: app
});
const koaBody = require('koa-body');
const session = require('koa-session');
const flash = require('koa-flash-simple')

const router = require('./router');

app.use(static('./public'));
app.use(session({
    key: 'koa:sess',
    maxAge: 'session',
    overwrite: true,
    httpOnly: true,
    signed: false,
    rolling: false,
    renew: false
}, app));
app.use(flash());
app.use(koaBody({
    formidable: {
        uploadDir: './public/assets/img/products', // Директория, куда следует сохранить файл
    },
    multipart: true
}));
app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3000, function() {
    console.log('Server running on localhost:3000')
});
