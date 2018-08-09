const fs = require('fs');
const path = require('path');
// const util = require('util');

// const fsrename = util.promisify(fs.rename);
// const fsunlink = util.promisify(fs.unlink);

const HttpError = require('../errorHandler');

// const products = require('../temp/products.json');

exports.getProducts = () => new Promise((resolve) => {
    let products = [];
    const productsFilePath = path.join(__dirname, '../temp/products.json');
    if (fs.existsSync(productsFilePath)) {
        products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    }
    resolve(products);
});

exports.uploadNewProduct = ({photo, name, price}) => new Promise((resolve) => {

    const { name: photoName, size, path: tempPath } = photo;
    const uploadDir = path.join(process.cwd(), '/public', 'assets', 'img', 'products');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    if (!name || !price) {
        fs.unlinkSync(tempPath);
        throw new HttpError('All fields are required', 400);
    }
    if (!photoName || !size) {
        fs.unlinkSync(tempPath);
        throw new HttpError('File not saved', 409);
    }

    fs.renameSync(tempPath, path.join(uploadDir, photoName));

    let products = [];
    const productsFilePath = path.join(process.cwd(), '/temp/products.json');
    if (fs.existsSync(productsFilePath)) {
        products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    }

    let newProducts = products.slice();
    newProducts.push({
        "src": "./assets/img/products/" + photoName,
        "name": name,
        "price": price
    });

    fs.writeFileSync(path.join(process.cwd(), '/temp/products.json'), JSON.stringify(newProducts));

    resolve({result: true});
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
