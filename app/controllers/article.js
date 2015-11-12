var mongoose = require('mongoose'),
    Article = mongoose.model("Article"),
    Comment = mongoose.model("Comment"),
    ObjectId = mongoose.Types.ObjectId;

exports.createArticle = function(req, res, next) {
    var articleModel = new Article(req.body);
    articleModel.save(function(err, article) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            res.json({
                type: true,
                data: article
            })
        }
    })
};

exports.viewArticle = function(req, res, next) {
    Article.findById(new ObjectId(req.params.id), function(err, article) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (article) {
                req.article = article;
                next();
            } else {
                res.json({
                    type: false,
                    data: "Article: " + req.params.id + " not found"
                })
            }
        }
    })
};

exports.viewArticle_v2 = function(req, res, next) {
    Article.findById(new ObjectId(req.params.id), function(err, article) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (article) {
                article.title = article.title + " v2";
                res.json({
                    type: true,
                    data: article
                })
            } else {
                res.json({
                    type: false,
                    data: "Article: " + req.params.id + " not found"
                })
            }
        }
    })
};

exports.updateArticle = function(req, res, next) {
    var updatedArticleModel = req.body;
    Article.findOneAndUpdate(req.params.id, updatedArticleModel, function(err, article) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (article) {
                req.updatedArticle = updatedArticleModel;
                next();
            } else {
                res.json({
                    type: false,
                    data: "Article: " + req.params.id + " not found"
                })
            }
        }

    });

    function callback(err, article) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (article) {
                res.render('edit-article/' + req.params.id, {
                    article: updatedArticleModel
                })
            } else {
                res.json({
                    type: false,
                    data: "Article: " + req.params.id + " not found"
                })
            }
        }
    }
};

exports.deleteArticle = function(req, res, next) {
    Article.findByIdAndRemove(new Object(req.params.id), function(err, article) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            Article.find({}, function(err, docs) {
                if (!err){
                    res.render('articles.html', {articles: docs, message: "Article: " + req.params.id + " deleted successfully"});
                } else {throw err;}
            });
        }
    })
};

exports.createArticleComment = function(req, res, next) {
    Article.findOne({_id: new ObjectId(req.params.id)}, function(err, article) {
        if (err) {
            res.json({
               type: false,
                data: "Error occured: " + err
            });
        } else {
            if (article) {
                var commentModel = new Comment(req.body);
                article.comments.push(commentModel);
                article.save(function(err, result) {
                    res.json({
                       type: true,
                        data: result
                    });
                });
            } else {
                res.json({
                    type: false,
                    data: "Article: " + req.params.id + " not found"
                });
            }
        }


    })
};

exports.viewArticles = function(req, res, next) {
    Article.find({}, function(err, articles) {
        if (!err){
            req.articles = articles;
            next();
        } else {throw err;}
    });
};
