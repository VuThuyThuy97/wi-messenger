
module.exports = function (io) {
        io.on('connection', function(socket) {
                socket.emit('connection', 'wellcome in chat-module');
                socket.on('join-rooms', function (listConver) {
                        listConver.forEach(function(conver) {
                                socket.join(conver.id);
                        });
                });
                socket.on('invite-join-room', function(data) {
                        socket.join(data.idConversation);
                        socket.broadcast.emit('invite-join-room', data);
                });
                socket.on('accept-join-romm', function(id) {
                        socket.join(id);
                });
                socket.on('sendMessage', function(data){
                        io.in(data.idConversation).emit('sendMessage', data);
                });
                socket.on('invite-join-group', function (data) {
                        socket.join(data.idConversation);
                        socket.broadcast.emit('invite-join-group', data);
                });
                socket.on('accept-foin-group', function (id) {
                        socket.join(id);
                });
        });
};