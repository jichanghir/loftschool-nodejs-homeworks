module.exports = (io) => {
    let users = {};

    io.sockets
        .on('connection', (socket) => {
            let id = socket.id;
            let user = {
                id,
                username: socket.handshake.headers.username || 'Guest'
            }
            users[id] = user;
            console.log('User connected to chat: ' + id);

            socket.emit('all users', users);
            socket.broadcast.emit('new user', user);

            socket.on('chat message', (data, recipientUserId) => {

                if (io.sockets.connected[recipientUserId]) {
                    io.to(recipientUserId).emit('chat message', data, user.id);
                }
            });

            socket.on('disconnect', (data) => {
                console.log('User disconnected from chat: ' + id);
                delete users[id];

                socket.broadcast.emit('delete user', id);
            });
        })

}

