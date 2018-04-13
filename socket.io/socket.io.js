
module.exports = function (io) {
        io.on('connection', function(socket) {

                socket.emit('connection', 'wellcome in chat-module');
        
                socket.on('listRoom', function (data) {
                        data.forEach(function(room) {
                                socket.join(room.id);
                        });
                });
                // socket.on('test', function (params) {
                // 	console.log('test');
                // })
                socket.on('sendMessage', function(data){
                        
                        // console.log(data.content);
                        io.in(data.conversation.id).emit('receiveMessage', data);
                });
                socket.on('joinRoomAdded', function (data) {
                        socket.join(data.id);
                })
                socket.on('addConver', function (data) {
                        console.log(data.id);
                        socket.join(data.conver.id);
                        if(data.conver.Users.length==1){
                                data.conver.title = data.sender.username;
                                data.conver.avatar = data.sender.avatar;
                        }
                        socket.broadcast.emit('addListConver', data);
                });
                socket.on('addUser', function (data) {
                        io.sockets.emit('addUserToConver', data);
                });
                socket.on('joinRoom', function(data){
                        socket.join(data.conver.id);
                })
        });
};