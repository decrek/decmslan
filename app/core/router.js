var express = require('express')
    , fs = require('fs')
    , nunjucks = require('nunjucks')
    , mongoose = require('mongoose')
    , Article = mongoose.model("Article")
    , markdown = require('nunjucks-markdown')
    , marked = require('marked');


var controllers = {}
    , controllers_path = process.cwd() + '/app/controllers';
fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') != -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
    }
});

var app = express();
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var nunjucksConfig = nunjucks.configure('app/web/templates/', {
    autoescape: true,
    express: app
});
markdown.register(nunjucksConfig, marked);

app.get('/api/articles', controllers.article.viewArticles, function(req, res, next) {
    res.json({
        type: true,
        data: req.articles
    })
});

app.get('/articles', controllers.article.viewArticles, function(req, res, next) {
    res.render('articles.html', { articles: req.articles });
});

app.get('/edit/articles/:id', controllers.article.viewArticle, function(req, res, next) {
    res.render('edit-article.html', { article: req.article });
});

app.post("/edit/articles/:id", controllers.article.updateArticle, controllers.article.viewArticles, function(req, res, next) {
    res.location('/articles');
    res.render('articles.html', { articles: req.articles });
});

// Article Start
app.post("/articles", controllers.article.createArticle);

app.post("/delete/articles/:id", controllers.article.deleteArticle);
app.get("/articles/:id", controllers.article.viewArticle);

app.get('/blog', controllers.blogpost.viewBlogPosts, function(req, res, next) {
    res.render('blogposts.html', {
        blogPosts: req.blogPosts
    })
});

app.get('/api/blog', controllers.blogpost.viewBlogPosts, function(req, res, next) {
    res.render('blogposts.html', res.json({
        type: true,
        data: req.blogPosts
    }))
});

app.post('/blog', controllers.blogpost.createBlogPost);

app.get("/edit/blog/:id", controllers.blogpost.editBlogPost);
app.post("/edit/blog/:id", controllers.blogpost.updateBlogPost, controllers.blogpost.viewBlogPosts, function(req, res, next) {
    res.location('/blog');
    res.render('blogposts.html', { blogPosts: req.blogPosts });
});

app.post("/delete/blog/:id", controllers.blogpost.deleteBlogPost);
app.get("/blog/:id", controllers.blogpost.viewBlogPost);


//app.get({path: "/articles/:id", version: "1.0.0"}, controllers.article.viewArticle)
//app.get({path: "/articles/:id", version: "2.0.0"}, controllers.article.viewArticle_v2)

// This is comment operations referenced in article
app.put("/articles/:id/comments", controllers.article.createArticleComment);
// Article End

// Comment Start
// You can also operate on commands in Comment resource. Some of the URI below, refers to above URIs for article
app.put("/comments/:id", controllers.comment.updateComment);
app.delete("/comments/:id", controllers.comment.deleteComment);
app.get("/comments/:id", controllers.comment.viewComment);
// Comment End


var port = process.env.PORT || 3000;
app.listen(port, function (err) {
    if (err)
        console.error(err);
    else
        console.log('App is ready at : ' + port);
});

if (process.env.environment == 'production')
    process.on('uncaughtException', function (err) {
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
    });
