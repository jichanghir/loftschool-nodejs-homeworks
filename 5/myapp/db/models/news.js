const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    date: {
        type: Date,
        default: new Date()
    },
    text: {
        type: String,
        default: ''
    },
    theme: {
        type: String,
        default: ''
    },
    userId: {
        type: String,
        required: true
    }
});

const News = module.exports = mongoose.model('News', schema);

// module.exports.saveNews = (newNews) => new Promise((resolve, reject) => {
//     News.save()
//     .then(resolve)
//     .catch(reject);
// });
