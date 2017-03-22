var express = require('express');
var routers = express.Router();
//权限控制
var auth = require('../middleware/auth');

var articleModel = require('../mongodb/db').articleModel;

//引入multer模块实现图片的上传
var multer = require('multer');
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'../public/uploads');//上传图片后保存的路径地址
    },
    filename:function(res,file,cb){
        cb(null,file.originalname);//上传图片后图片的名字等于原来图片的名字
    }
});

var upload = multer({storage:storage});//配置（upload是一个中间件处理函数）

routers.get('/add',auth.checkLogin,function(req,res){
    res.render('article/add',{title:'发表文章',content:"发表文章"});
});
routers.post('/add',auth.checkLogin,upload.single('poster'),function(req,res){
    //1.获取表单提交的文章信息
    var articleInfo = req.body;

    if(req.file){
        console.log(req.file);
        articleInfo.poster = '/uploads/'+req.file.filename;
    }
    //设置发表文章时间
    articleInfo.createAt = Date.now();
    //文章作者
    articleInfo.user = req.session.user._id;
    //2.将文章信息保存到数据库中
    articleModel.create(articleInfo,function(err,doc){
        if(!err){
            req.flash('success','用户发表文章成功');
            res.redirect('/');
        }else{
            req.flash('error','用户发表文章失败');
            res.redirect('back');
        }
    });
});


routers.get('/detail/:id',auth.checkLogin,function(req,res){
    var id = req.params.id;
    articleModel.findById({_id:id},function(err,article){
        article.user = req.session.user;
        if(!err){
            req.flash('success','进入详情页成功');
            res.render('article/detail',{title:'文章详情',article:article});
        }else{
            req.flash('error','进入详情页失败');
            res.redirect('back');
        }
    })
});
routers.get('/remove/:id',auth.checkLogin,function(req,res){
    var id = req.params.id;
    articleModel.remove({_id:id},function(err,article){
        if(!err){
            req.flash('success','删除成功');
            res.redirect('/');
        }else{
            req.flash('error','删除失败');
            res.redirect('back');
        }
    });
});
routers.get('/edit/:_id',function(req,res){
    var _id = req.params._id;
    articleModel.findById({_id:_id},function(err,doc){
        if(!err){
            req.flash('success','编辑文章页面信息成功');
            res.render('article/edit',{title:'文章编辑页面',article:doc});
        }else{
            req.flash('error','编辑文章页面信息失败');
            res.redirect('back');
        }
    })
});
routers.post('/edit/:_id',auth.checkLogin,upload.single('poster'),function(req,res){
    var _id = req.params._id;
    var article = req.body;
    if(req.file){
        article.poster = '/uploads/'+req.file.filename;
    }
    articleModel.update({_id:_id},{$set:article},function(err,doc){
        if(!err){
            req.flash('success','更新文章信息成功');
            res.redirect('/');
        }else{
            req.flash('error','更新文章信息失败');
            res.redirect('back');
        }
    });
});
module.exports = routers;
