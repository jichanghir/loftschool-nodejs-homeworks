const User = require('../../db/models/user');
const jwt = require('jsonwebtoken');

exports.saveNewUser = ({username, surName, firstName, middleName, password}) => new Promise(async (resolve, reject) => {
    try {
        if (!username || !password) {
            resolve({
                success: false,
                message: 'Username and password are required'
            });
            return;
        }

        let existedUser = await User.getUserByUsername(username);
        if (existedUser) {
            resolve({
                success: false,
                message: 'Username are already exist'
            });
            return;
        }

        let newUser = new User({
            username,
            surName,
            firstName,
            middleName,
            password,
            permission: {
                chat: {C: true, D: true, R: true, U: true},
                news: {C: true, D: true, R: true, U: true},
                setting: {C: true, D: true, R: true, U: true}
            },
            permissionId: Math.random()
        });

        let savedUser = await User.createUser(newUser);

        let resolvedUser = {
            firstName: savedUser.firstName || '',
            id: savedUser._id,
            image: savedUser.image || '',
            middleName: savedUser.middleName || '',
            password: password || '',
            permission: savedUser.permission,
            permissionId: savedUser.permissionId || null,
            surName: savedUser.surName || '',
            username: savedUser.username
        }

        resolve(resolvedUser);

    }
    catch (err) {
        reject(err);
    }
});

exports.login = ({username, password}) => new Promise(async (resolve, reject) => {
    try {
        if (!username || !password) {
            resolve({
                success: false,
                message: 'Username and password are required'
            });
            return;
        }

        let existedUser = await User.getUserByUsername(username);
        if (!existedUser) {
            resolve({
                success: false,
                message: 'Username are not existed'
            });
            return;
        }

        const compareResult = await User.comparePassword(password, existedUser.password);
        if (!compareResult) {
            resolve({
                success: false,
                message: 'Password are not correct'
            });
            return;
        }

        const token = jwt.sign(JSON.parse(JSON.stringify(existedUser)), 'secret', {expiresIn: 60 * 5});

        let resolvedUser = {
            firstName: existedUser.firstName || '',
            id: existedUser._id,
            image: existedUser.image || '',
            middleName: existedUser.middleName || '',
            password: password || '',
            permission: existedUser.permission,
            permissionId: existedUser.permissionId || null,
            surName: existedUser.surName || '',
            username: existedUser.username,
            access_token: token
        }

        resolve(resolvedUser);
    }
    catch (err) {
        reject(err);
    }
});

exports.updateUser = ({id, firstName, middleName, surName, oldPassword, password}) => new Promise(async (resolve, reject) => {
    try {
        if (!id) {
            resolve({
                success: false,
                message: 'id are required'
            });
            return;
        }

        let user = await User.getUserById(id);
        if (!user) {
            resolve({
                success: false,
                message: 'User dosnt exist'
            });
        }

        if ((oldPassword && !password) || (password && !oldPassword)) {
            resolve({
                success: false,
                message: 'You must provide password & oldPassword'
            });
            return;
        }
        if (oldPassword && password) {
            let isPasswordEquals = await User.comparePassword(oldPassword, user.password);
            if (!isPasswordEquals) {
                resolve({
                    success: false,
                    message: 'old password are invalid'
                });
                return;
            }

            user.password = password;
            user = await User.updateUserPassword(user);

        }

        if (firstName) {
            user.set({firstName});
        }
        if (middleName) {
            user.set({middleName});
        }
        if (surName) {
            user.set({surName});
        }

        const updatedUser = await User.updateUser(user);
        const token = jwt.sign(JSON.parse(JSON.stringify(user)), 'secret', {expiresIn: 60 * 5});

        const resolvedUser = {
            firstName: updatedUser.firstName || '',
            id: updatedUser._id,
            image: updatedUser.image || '',
            middleName: updatedUser.middleName || '',
            password: password || '',
            permission: updatedUser.permission,
            permissionId: updatedUser.permissionId || null,
            surName: updatedUser.surName || '',
            username: updatedUser.username,
            access_token: token
        }

        resolve(resolvedUser);
    }
    catch (err) {
        reject(err);
    }
});


exports.deleteUser = ({id}) => new Promise(async (resolve, reject) => {
    try {
        if (!id) {
            resolve({
                success: false,
                message: 'id are required'
            });
            return;
        }

        let deletedUser = await User.removeById(id);
        resolve(deletedUser);
    }
    catch (err) {
        reject(err);
    }
});

exports.getUsers = () => new Promise(async (resolve, reject) => {
    try {
        const allUsers = await User.find();

        let resolvedResult = allUsers.map((user) => {
            return {
                firstName: user.firstName || '',
                id: user._id,
                image: user.image || '',
                middleName: user.middleName || '',
                permission: user.permission,
                permissionId: user.permissionId || null,
                surName: user.surName || '',
                username: user.username
            }
        });

        resolve(resolvedResult);
    }
    catch (err) {
        reject(err);
    }
});

exports.updateUserPermission = ({permissionId, permission}) => new Promise(async (resolve, reject) => {
    try {
        if (!permissionId || !permission) {
            resolve({
                success: false,
                message: 'permissionId and permission are required'
            });
            return;
        }

        const existedUser = await User.findOne({permissionId: +permissionId});
        if (!existedUser) {
            resolve({
                success: false,
                message: 'User dosnt exist'
            });
            return;
        }

        let existedPermission = existedUser.permission;

        Object.keys(permission).forEach((permissionGroup) => {
            Object.keys(permission[permissionGroup]).forEach((permissionKey) => {
                const newValue = permission[permissionGroup][permissionKey];
                existedPermission[permissionGroup][permissionKey] = newValue;
            });
        });

        existedUser.set({permission: existedPermission});
        await existedUser.save();

        resolve(true);
    }
    catch (err) {
        reject(err);
    }
});

