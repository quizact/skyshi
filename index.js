const express = require('express')
const app = express()
const port = 3000

//import library CORS
const cors = require('cors')

//use cors
app.use(cors())

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

const activity = require('./routes/activity-group');

app.use('/activity-group', activity);

const api = require('./routes/activity-api');

app.use('/activity-api', api);

const todo = require('./routes/todo-items');

app.use('/todo-items', todo);

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`)
})