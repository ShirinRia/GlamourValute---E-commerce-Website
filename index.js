const express = require('express')
var cors = require('cors')
require('dotenv').config()
var app = express()

app.use(cors())
app.use(express.json())
const port = process.env.PORT||5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})