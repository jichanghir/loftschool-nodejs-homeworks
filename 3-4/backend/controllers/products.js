const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const products = require('../temp/products.json');

exports.getProducts = () => new Promise((resolve) => {
    resolve(products);
});

exports.uploadNewProduct = (req) => new Promise((resolve, reject) => {

    const form = new formidable.IncomingForm();
    const uploadDir = path.join(__dirname, '../public/', 'assets', 'img', 'products');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        if (err) {
            reject({
                code: 409,
                message: 'File not saved'
            });
        }

        if (!files.photo.name || !files.photo.size) {
            reject({
                code: 409,
                message: 'File not saved'
            });
        }

        if (!fields.name || !fields.price) {
            fs.unlink(files.photo.path);
            reject({
                code: 400,
                message: 'Не указано описание картинки'
            });
        }

        fs.rename(files.photo.path, path.join(uploadDir, files.photo.name), (err) => {
            if (err) {
                console.error("err", err);
                fs.unlink(files.photo.path);
                reject({
                    code: 409,
                    message: 'File not saved'
                });
            }

            let newProducts = products.slice();
            newProducts.push({
                "src": "./assets/img/products/" + files.photo.name,
                "name": fields.name,
                "price": fields.price
            });

            fs.writeFile(path.join(__dirname, '../temp/products.json'), JSON.stringify(newProducts), (err) => {
                if (err) {
                    reject({
                        code: 500,
                        message: err
                    });
                }

                resolve({result: true});
            })
        })

    });

});

// var products = [
//     {
//         "src": "./assets/img/products/Work1.jpg",
//         "name": "Вино вдохновение",
//         "price": 600
//     },
//     {
//         "src": "./assets/img/products/Work2.jpg",
//         "name": "Вино вдохновение",
//         "price": 600
//     },
//     {
//         "src": "./assets/img/products/Work3.jpg",
//         "name": "Вино вдохновение",
//         "price": 600
//     },
//     {
//         "src": "./assets/img/products/Work4.jpg",
//         "name": "Вино вдохновение",
//         "price": 600
//     },
//     {
//         "src": "./assets/img/products/Work5.jpg",
//         "name": "Вино вдохновение",
//         "price": 600
//     },
//     {
//         "src": "./assets/img/products/Work6.jpg",
//         "name": "Вино вдохновение",
//         "price": 600
//     },
//     {
//         "src": "./assets/img/products/Work7.jpg",
//         "name": "Вино вдохновение",
//         "price": 600
//     },
//     {
//         "src": "./assets/img/products/Work8.jpg",
//         "name": "Вино вдохновение",
//         "price": 600
//     },
//     {
//         "src": "./assets/img/products/Work9.jpg",
//         "name": "Вино вдохновение",
//         "price": 600
//     }
// ]
