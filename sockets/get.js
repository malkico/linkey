const click = require('./click')
const search = require('./search')

module.exports = (socket) => {
    // console.log("connexion from socket")
    socket.on("click", click)
    socket.on("search",search)
}

