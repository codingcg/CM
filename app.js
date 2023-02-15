const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');

require('dotenv').config();

app = express();
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

handlebars.handlebars.registerHelper('ifEqual', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
handlebars.handlebars.registerHelper('ifNotEqual', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});
handlebars.handlebars.registerHelper('contains', function(needle, haystack, options) {
    needle = handlebars.handlebars.escapeExpression(needle);
    haystack = handlebars.handlebars.escapeExpression(haystack);
    return (haystack.indexOf(needle) > -1) ? options.fn(this) : options.inverse(this);
 });
/*handlebars.handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});
handlebars.handlebars.registerHelper("setVar", function(varName, varValue, options) {
  options.data.root[varName] = varValue;
});
handlebars.handlebars.registerHelper('concat', function() {
    arguments = [...arguments].slice(0, -1);
    return arguments.join('');
});*/
//app.locals.info = 42;



app.listen(port, () => console.log(`Listening on port ${port}`));