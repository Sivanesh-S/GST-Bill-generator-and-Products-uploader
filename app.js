const express = require('express')
const app = express();
const socketIO = require('socket.io')
const http = require('http')
const port = 3000 || process.env.port
const server = app.listen(port, () => {
    console.log(`Program is running at port ${port}`)
})
const io = socketIO.listen(server)
const mysql = require('mysql')
const con = mysql.createConnection({
    host: 'confidential',
    user: 'confidential', 
    password: '**********',
    database: 'confidential'
})


app.set('view engine', 'ejs')
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/billing', (req, res) => {
    res.render('billing')
})



io.on('connection', (socket) => { 
    console.log("A socket is connected")
    socket.on('addList', data => {
        console.log(data)
        
        con.query(`insert into list values('${data.code}', '${data.name}', ${data.price}, ${data.gst})`, (err) => {
            if(err) throw err
            else console.log("Inserted successfully")
            updateList()
        })
        
    })

    
        function updateList() {
            con.query('select * from list', (err, results) => {
                socket.emit('datalist', { data: JSON.parse(JSON.stringify(results)) })
            })
        }
        updateList()
    
    
})
