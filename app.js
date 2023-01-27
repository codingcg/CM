const express = require('express');
const exphbs = require('express-handlebars');
//const bodyParser = require('body-parser'); // No longer Required
const session = require('express-session');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
	/*cookie: {
		secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    }*/
}));




// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true })); // New

// Parse application/json
// app.use(bodyParser.json());
app.use(express.json()); // New

// Static Files
app.use(express.static('public'));

// Templating Engine
const handlebars = exphbs.create({ extname: '.hbs', });


//when configuring the app view engine
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
}));
app.set('view engine', '.hbs');


const userRoutes = require('./server/routes/user');
app.use('/', userRoutes);

app.listen(port, () => console.log(`Listening on port ${port}`));