var mongoose = require('mongoose'),
    BlogPost = mongoose.model("BlogPost"),
    ObjectId = mongoose.Types.ObjectId;

exports.createBlogPost = function(req, res, next) {
    var blogPostModel = new BlogPost(req.body);
    blogPostModel.save(function(err, blogpost) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            res.json({
                type: true,
                data: blogpost
            })
        }
    });
};

exports.viewBlogPosts = function(req, res, next) {
    BlogPost.find({}, function(err, blogPosts) {
        if (!err){
            req.blogPosts = blogPosts;
            next();
        } else {throw err;}
    });
};

exports.viewBlogPost = function(req, res, next) {
    BlogPost.findById(new ObjectId(req.params.id), function(err, blogPost) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (blogPost) {
                res.json({
                    type: true,
                    data: blogPost
                })
            } else {
                res.json({
                    type: false,
                    data: "Blog post: " + req.params.id + " not found"
                })
            }
        }
    })
};

exports.updateBlogPost = function(req, res, next) {
    var updatedBlogPostModel = req.body;
    BlogPost.findOneAndUpdate(req.params.id, updatedBlogPostModel, function(err, blogPost) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (blogPost) {
                req.blogPost = blogPost;
                next();
            } else {
                res.json({
                    type: false,
                    data: "Blog post: " + req.params.id + " not found"
                })
            }
        }
    });
};

exports.deleteBlogPost = function(req, res, next) {
    BlogPost.findByIdAndRemove(new Object(req.params.id), function(err, blogPost) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            BlogPost.find({}, function(err, docs) {
                if (!err){
                    res.render('blogposts.html', {blogPosts: docs, message: "Blog post: " + req.params.id + " deleted successfully"});
                } else {throw err;}
            });
        }
    })
};

exports.editBlogPost = function(req, res, next) {
 BlogPost.findById(new ObjectId(req.params.id), function(err, blogPost) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (blogPost) {
                res.render('edit-blog-post.html', {
                    blogPost: blogPost
                })
            } else {
                res.json({
                    type: false,
                    data: "Blog post: " + req.params.id + " not found"
                })
            }
        }
    })
};