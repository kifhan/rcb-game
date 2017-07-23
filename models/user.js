var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema
var userSchema = new Schema({
  username: Schema.Types.String,
  password: Schema.Types.String,
  nickname: Schema.Types.String,
  role: Schema.Types.Mixed
})
// schema.methods에 함수를 만들어 넣으면 model.function()으로 불러와서 사용할 수 있다.
userSchema.methods.generateHash = function(password) { //password를 암호화
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}
userSchema.methods.validatePassword = function(password) { //password의 유효성 검증
  try { return bcrypt.compareSync(password, this.password) }
  catch (err) { throw err; }
}
// userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('user', userSchema)