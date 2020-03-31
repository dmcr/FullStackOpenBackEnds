const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

app.use(cors())
app.use(express.json())



const port = 3000

app.get('/', (req, res) => res.send('Test2'))

app.listen(port, () => console.log(`Server listening on port ${port}`))