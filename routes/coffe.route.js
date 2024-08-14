const express = require(`express`)
const coffeController = require(`../controllers/coffe.controller`)
const auth = require('../controllers/auth.controller')
const app = express()
app.use(express.json())

app.get('/getall', coffeController.getAll)
app.get('/:key', coffeController.findCoffe)
app.post('/', auth.authorize, coffeController.addCoffe)
app.put('/:id', auth.authorize, coffeController.updateCoffe)
app.delete('/:id', auth.authorize, coffeController.deleteCar)

module.exports = app