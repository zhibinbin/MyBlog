var express = require('express');
//引入path模块 join __dirname resolve
var path = require('path');
var favicon = require('serve-favicon');
//打印日志的模块
var logger = require('morgan');
//cookie
var cookieParser = require('cookie-parser');
//post请求
var bodyParser = require('body-parser');
//引入session模块
var session = require('express-session');
//将session信息保存到数据库中
var MongoStore = require('connect-mongo')(session);
//引入flash模块
var flash = require('connect-flash');

//引入路由容器
var index = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');

var app = express();

// view engine setup
//设置模板引擎文件根路径
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎文件类型
app.set('view engine', 'html');
app.engine('html',require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//用来请求请求体是json对象
app.use(bodyParser.json());
//用来处理post表单提交
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//设置静态资源文件的根路径
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'come',
  resave:true,
  saveUninitialized:true,
  store:new MongoStore({
  //  数据库的连接地址
    url:require('./dburl').dbUrl
  })
}));

//使用flash模块
app.use(flash());

//公共中间件，用来处理所有路由中的公共操作
app.use(function(req,res,next){
  //向所有的模板引擎文件都增加user属性
  res.locals.user = req.session.user;//获取session中用户登录的信息
  //成功的提示信息
  res.locals.success = req.flash('success');
  //失败的提示信息
  res.locals.error = req.flash('error');

  res.locals.keyword = req.session.keyword;
  next();
});

//中间件
//所有/开头的路由交给index路由容器处理
app.use('/', index);
//所有/user开头的路由交给user路由容器处理
app.use('/user', user);
app.use('/article',article);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {//错误处理中间件
  // set locals, only providing error in development
  //给模板引擎文件传递数据的第二种方式
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
