const express = require('express')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Parsing Middleware
//Parse Application / X-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Parse application/json
app.use(bodyParser.json());

//Static Files
app.use(express.static('public'));

//Template Engine
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

//Connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.DB_NAME
});


// Connect to DB
pool.getConnection((err, connection) => {
    if (err) throw err; // Not Connected!
    console.log('connected as ID' + connection.threadId);
});


//Router
const routes = require('./server/routes/user');
app.use('/', routes);

app.listen(port, () => console.log(`Listening on port${port}`));