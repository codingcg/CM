const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

// Static Files
app.use(express.static('/public'));

// Templating Engine
const handlebars = exphbs.create({ extname: '.hbs', });

//when configuring the app view engine
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
}));
app.set('view engine', '.hbs');

const userRoutes = require('./server/routes/user');
app.use('/', userRoutes);

handlebars.handlebars.registerHelper('ifEquals', function(arg1, arg2, arg3, options) {
    return (arg1 == arg2 | arg1 == arg3) ? options.fn(this) : options.inverse(this);
});

app.listen(port, () => console.log(`Listening on port ${port}`));