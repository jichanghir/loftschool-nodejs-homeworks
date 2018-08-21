const News = require('../../db/models/news');
const User = require('../../db/models/user');

const getNews = exports.getNews = () => new Promise(async (resolve, reject) => {
    try {
        // возвращаем все новости всех юзеров
        allNews = await News.find();
        allUsers = await User.find();

        const resolvedResult = allNews.map((news) => {
            let user = allUsers.find((u) => u._id.toString() === news.userId);
            // если юзера нету, то новость все равно выводим
            if (!user) {
                user = {
                    firstName: 'Undefined',
                    id: null,
                    image: '',
                    middleName: 'Undefined',
                    surName: 'Undefined',
                    username: 'Undefined'
                }
            }
            return {
                id: news._id,
                date: news.date,
                text: news.text,
                theme: news.theme,
                user: {
                    firstName: user.firstName || '',
                    id: user._id,
                    image: user.image || '',
                    middleName: user.middleName || '',
                    surName: user.surName || '',
                    username: user.username
                }
            }
        });

        resolve(resolvedResult);
    }
    catch (err) {
        reject(err);
    }
});

exports.newNews = ({userId, date, text, theme}) => new Promise(async (resolve, reject) => {
    try {
        if (!userId) {
            resolve({
                success: false,
                message: 'userId is required'
            });
            return;
        }

        // сначала надо определить существует ли такой пользователь
        const existedUser = await User.findById(userId);
        if (!existedUser) {
            resolve({
                success: false,
                message: 'User are not existed'
            });
            return;
        }

        // затем просто сохраняем новость и указываем какого она пользователя
        const newNews = new News({
            date: new Date(date),
            text,
            theme,
            userId
        });
        await newNews.save();

        // возвращаем все новости всех юзеров
        const resolvedResult = await getNews();

        resolve(resolvedResult);

    }
    catch (err) {
        reject(err);
    }
});

exports.updateNews = ({userId, id, date, text, theme}) => new Promise(async (resolve, reject) => {
    try {
        if (!userId) {
            resolve({
                success: false,
                message: 'userId is required'
            });
            return;
        }
        if (!id) {
            resolve({
                success: false,
                message: 'news id is required'
            });
            return;
        }

        // сначала надо определить существует ли такой пользователь
        const existedUser = await User.findById(userId);
        if (!existedUser) {
            resolve({
                success: false,
                message: 'User are not existed'
            });
            return;
        }

        // потом определить существует ли такая новость
        const existedNews = await News.findById(id);
        if (!existedNews) {
            resolve({
                success: false,
                message: 'News are not existed'
            });
            return;
        }

        // обновляем значения новости
        existedNews.set({date, text, theme});
        await existedNews.save();

        // возвращаем все новости всех юзеров
        const resolvedResult = await getNews();

        resolve(resolvedResult);
    }
    catch (err) {
        reject(err);
    }
});

exports.deleteNews = ({id}) => new Promise(async (resolve, reject) => {
    try {
        if (!id) {
            resolve({
                success: false,
                message: 'news id is required'
            });
            return;
        }

        // удаляем новость
        await News.findByIdAndRemove(id);

        // возвращаем все новости всех юзеров
        const resolvedResult = await getNews();

        resolve(resolvedResult);
    }
    catch (err) {
        reject(err);
    }
});


