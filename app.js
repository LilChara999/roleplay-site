var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var pug = require('pug');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const vue = require('vue');
const compiler = require('vue-template-compiler');

// require('./config/passport');

require.extensions['.vue'] = (module, filename) => {
    let file = fs.readFileSync(filename, 'utf8');
    let {script, template} = compiler.parseComponent(file);
    let {render, staticRenderFns} = compiler.compile(template.content);
    let result = `(function(){'use strict';${script.content}})();Object.assign(module.exports,{render:function(){${render}},staticRenderFns:[${staticRenderFns.map(code => {
        return `function(){${code}}`;
    }).join(',')}]});`;
     module._compile(result, filename);
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/roleplay_site');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashboardRouter = require('./routes/dashboard');
var modalRouter = require('./routes/modal');
var diaryRouter = require('./routes/diary');
var profileRouter = require('./routes/profile');
var formsRouter = require('./routes/forms');
var coplayersRouter = require('./routes/coplayers');
var coplayers_postsRouter = require('./routes/coplayers_posts');
var friendsRouter = require('./routes/friends');
var friends_postsRouter = require('./routes/friends_posts');
var discussionsRouter = require('./routes/discussions');
var private_messagesRouter = require('./routes/private_messages');
var players_ratingRouter = require('./routes/players_rating');
var my_roleplaysRouter = require('./routes/my_roleplays');
var my_ownRouter = require('./routes/my_own');
var participate_roleplaysRouter = require('./routes/participate_roleplays');
var roleplays_listRouter = require('./routes/roleplays_list');
var roleplays_ratingRouter = require('./routes/roleplays_rating')
var settingsRouter = require('./routes/settings');
var exitRouter = require('./routes/exit');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_mesages = req.flash('success')
  res.locals.error_messages = req.flash('error')
  next()
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', dashboardRouter);
app.use('/modal', modalRouter);
app.use('/dashboard', dashboardRouter);
app.use('/diary', diaryRouter);
app.use('/profile', profileRouter);
app.use('/forms', formsRouter);
app.use('/coplayers', coplayersRouter);
app.use('/coplayers_posts', coplayers_postsRouter);
app.use('/friends', friendsRouter);
app.use('/friends_posts', friends_postsRouter);
app.use('/discussions', discussionsRouter);
app.use('/private_messages', private_messagesRouter);
app.use('/players_rating', players_ratingRouter);
app.use('/my_roleplays', my_roleplaysRouter);
app.use('/my_own', my_ownRouter);
app.use('/participate_roleplays', participate_roleplaysRouter);
app.use('/roleplays_list', roleplays_listRouter);
app.use('/roleplays_rating', roleplays_ratingRouter);
app.use('/settings', settingsRouter);
app.use('/exit', exitRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
