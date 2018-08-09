const HttpError = require('../errorHandler');

exports.auth = ({email, password}) => new Promise((resolve, reject) => {
    // запрос к бд
    if (!email || !password) {
        throw new HttpError('Email and password are required', 400);
    }

    if (email !== 'admin@admin.com' || password !== 'admin') {
        throw new HttpError('Unauthorized', 400);
    }

    resolve({result: true});
});
