const express = require('express')
const cors = require('cors')
const path  = require('path')

const authRoute = require('./routes/auth.route')
const coffeRoute = require('./routes/coffe.route')
const orderRoute = require('./routes/order.route')

const port = 5000
const app = express()

app.use(cors())

app.use('/login', authRoute)
app.use('/coffe', coffeRoute)
app.use('/order', orderRoute)
app.use(express.static(path.join(__dirname, 'image')));
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})