var mongoose = require('mongoose');
mongoose.connect(require('../dbUrl').dbUrl);
//创建集合中的字段
var userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    //用户的头像地址
    avatar:String
});
//创建集合
var userModel = mongoose.model('user',userSchema);

//创建文章相关的模型
var articleSchema = new mongoose.Schema({
    title:String,
    content:String,
    poster:String,//上传的图片
    createAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
});
//创建文章集合
var articleModel = mongoose.model('article',articleSchema);

module.exports.articleModel = articleModel;
//用户相关的集合导出
module.exports.userModel = userModel;
