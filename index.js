const express = require('express');
const bodyParser = require('body-parser');
const labRoutes = require('./routes/labRoute');
const db = require("./db");

var app = express()

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/labs', labRoutes);

// db.connection.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
//     db.connection.end();
// });

app.listen(8080, function () {
    console.log('Roche Coding Exercise running on 8080!');
});