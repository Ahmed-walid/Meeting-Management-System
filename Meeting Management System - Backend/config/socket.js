let io;

module.exports = {
    init : (httpServer, options)=>{
        io = require('socket.io')(httpServer, options);
        return io;
    },
    getIO : ()=>{
        if(!io)
            throw Error("there is no Websocket IO object initialized yet");
        return io;
    }
}