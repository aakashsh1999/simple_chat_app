const express = require('express')
const {createServer} = require('http')

const app = express()
const server = createServer(app);

const port = 8000;

const {Server} = require('socket.io')

const io = new Server(server, {
    cors:{
        origin: "*"
    }
})


io.on('connection', socket =>{
        console.log(`A user Connected successfullly ${socket.id}`)
        socket.on("join_room", ({user, room}) =>{
            socket.join(room)
        })

        socket.on("send_msg", ({user, room, message}) =>{
            console.log(message)
            const d = {user : user, message: message}
            socket.to(room).emit("recieve_msg", d)
        })
})


server.listen(port, ()=>{
    console.log('server is listening on port '+ port)
})