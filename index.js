const config = require("config");
const express = require('express');
const mongoose = require('mongoose');
const router = require('./router');


//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
    console.error("FATAL ERROR: myprivatekey is not defined.");
    process.exit(1);
}


mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://127.0.0.1/test_db", { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

});

const app = express()
app.use(express.json());
app.use(router);
const port = 3000



app.listen(port, () => {
    console.log('Server has been started...')
})

var igor = require('./models/User');

console.log(igor);

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))