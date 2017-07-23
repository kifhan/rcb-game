// app.js 는 express, route, passport를 설정한다. 웹서버 실행코드가 있는 /bin/www 에서 require 해서 사용한다.
// template는 express-generator로 생성했다. Express v4

var express = require('express'); // HTTP 패킷을 해석하는 웹서버 엔진
var path = require('path'); // 로컬 file path를 찾아주는 모듈
var favicon = require('serve-favicon'); // 브라우져 아이콘 전달해주는 모듈
var logger = require('morgan'); // express 엔진의 디버그 메세지를 출력하는 모듈
var cookieParser = require('cookie-parser'); // key-value 방식으로 브라우져 쿠키 관리하는 모듈
var bodyParser = require('body-parser'); // http 패킷을 json 등등으로 파싱하는 모듈
var routes = require('./routes'); // 웹 주소를 해석하여 해당 시퀀스로 보내주는 모듈
var session = require('express-session'); // 서버에서 접속자 정보를 저장하는 세션을 관리하는 모듈
var cors = require('cors') // for cross browser ajax allow setting
var app = express(); // express 초기화
var mongoose = require('mongoose'); // mongodb 데이터베이스를 node.js에 연결하는 브릿지 모듈
var passport = require('passport'); // 내부, 외부 사이트 로그인 인증을 관리하는 모듈

// view engine setup - 샘플 jade파일이 있어서 그대로 두었는데 나는 jade 사용안함
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// router에서 jade 사용 예: res.render('index', { title: 'Express' });

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 프로세스가 필요없는 정적인 파일 호출을 라우팅한다.
app.use(session({ secret: 'peter is the best cat in the world wink wink', resave: true, saveUninitialized: false  }));
// 서버 세션 설정. 암호화 키
app.use(passport.initialize());
app.use(passport.session()); // 사용자 로그인 현황 정보 등을 서버에서 저장한다.
app.use(cors()) // ajax 호출 허용. blank일때 어떤 도메인에서 ajax 호출해도 다 허용.

var flash = require('connect-flash'); // 화면 상단에 내려오는 플레시 메세지를 표시하는 모듈이다. 버튼 없는 모달
app.use(flash());

// route setting
app.use('/', routes.index); // ./routes/index.js에 설정되어 있다. 기본 설정
// app.use('/users', routes.users); // ./routes/users.js
// app.use('/play', routes.play); // ./routes/accounts.js
// app.use('/transactions', routes.transactions); // ./routes/transactions.js
// app.use('/rest', routes.rest); // RESTful API 라우팅

require('./passport_config')(passport) // Passport Local Strategy 설정 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  // err: { message, status, stack }
});

module.exports = app;
