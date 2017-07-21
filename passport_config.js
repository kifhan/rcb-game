var LocalStrategy = require('passport-local').Strategy; // passport - 사이트 내부 로그인 연결 모듈
var User = require('./models/user')

module.exports = function(passport) {
    // passport local 회원가입 로직 
    passport.use('signup', new LocalStrategy({
        usernameField: 'username', // mongoose db schema 이름을 커스텀으로 정한다. 같은 필드를 schema 파일에 넣어야 한다.
        passwordField: 'password',
        passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로 전달할지 여부를 결정한다
    },
    function(req, username, password, done) {
        User.findOne({ 'username' : username }, function(err, user) {
            if (err) return done(err);
            if (user) {
                return done(null, false, req.flash('signupMessage', '사용자 ID가 존재합니다.'));
            } else {
                var newUser = new User();
                newUser.username = username;
                newUser.nickname = req.body.nickname;
                newUser.password = newUser.generateHash(password); 
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }));

    // passport local 로그인 인증로직
    passport.use('login', new LocalStrategy({
        usernameField: 'username', // mongoose db schema 이름을 커스텀으로 정한다. 같은 필드를 schema 파일에 넣어야 한다.
        passwordField: 'password',
        passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로 전달할지 여부를 결정한다
    }, function (req, username, password, done) { // POST 보낼 때도 schema 이름 맞춰줘야 한다.
        User.findOne({ 'username' : username }, function(err, user) {
            if (err)
                return done(err); // done() 함수는 결과를 serializeUser을 넘긴다.
            if (!user)
                return done(null, false, req.flash('loginMessage', '사용자를 찾을 수 없습니다.')); 
            // req.flash는 상단에 뜨는 플래시 메세지를 표시한다.
            if (!user.validatePassword(password))
                return done(null, false, req.flash('loginMessage', '비밀번호가 다릅니다.')); 
            return done(null, user);
        });
    }));

    passport.serializeUser(function (user, done) { // 사용자 정보를 Session에 저장한다.
        done(null, user.id)
    });
    passport.deserializeUser(function (id, done) { // 이미 접속되어 있으면 Session에 저장된 정보를 가져와서 복원한다.
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}