
module.exports = function (io) {
        io.on('connection', function (socket) {
            
            socket.emit('connection', 'wellcome in chat-module');
            socket.on('join-room', function (data) { 
                socket.join(data.idConversation);
            });
            socket.on('sendMessage', function (data) {
                io.in(data.idConversation).emit('sendMessage', data);
            });
            socket.on('disconnect', function() {
                console.log(socket.id, ' disconnect');
            });
        });
};
