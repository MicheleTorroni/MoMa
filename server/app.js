// imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const http = require('http').Server(app)
const socketIo = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
})
const port = process.env.SERVER_PORT // 5000
const socketIoPort = process.env.SOCKET_IO_PORT

//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('uploads'))

//database connection 
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
}).then(() => console.log('Connected to the database: ' + process.env.DB_URI)).catch(err => console.log(err))

//routes prefix
app.use('/api/transactions', require('./routes/transactionsRoutes'))
app.use('/api/accounts', require('./routes/accountsRoutes'))
app.use('/api/categories', require('./routes/categoriesRoutes'))
app.use('/api/wallets', require('./routes/walletsRoutes'))

//start server 
app.listen(port, () => console.log(`Server running at http://localhost:${port}`))

//socketIo
socketIo.on("connection", socket => {
    //console.log('client connected: ' + socket + " | " + new Date().getTime())
    socket.on("roomUser", username => {
        socket.join(username)
        socketIo.to(username).emit("serverMessage", { priotity: "low", message: "sei stato connesso alla room: " + username })
    })

    socket.on("clientMessage", clientMessage => {
        socketIo.to(clientMessage.username).emit("serverMessage", { priority: "low", message: clientMessage.message })

        if (clientMessage.username == "admin") socket.broadcast.emit("serverMessage", { priority: "high", message: clientMessage.message })

        //socket.emit("serverMessage", 'got client message: ' + message + " | " + new Date().getTime())
    })

})

http.listen(socketIoPort, () => {
    console.log("Socket Io listening at http://localhost:" + socketIoPort)
})
