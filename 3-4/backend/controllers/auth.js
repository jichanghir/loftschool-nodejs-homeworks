exports.auth = (req) => new Promise((resolve, reject) => {
    // запрос к бд
    if (!req.body.email || !req.body.password) {
        reject({
            code: 400,
            message: 'Email and password are required'
        });
    }

    if (req.body.email !== 'admin@admin.com' || req.body.password !== 'admin') {
        reject({
            code: 401,
            message: 'Unauthorized'
        });
    }

    resolve({result: true});
});
