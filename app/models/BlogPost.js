var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var BlogPostSchema = new Schema({
    teaser: String,
    name: String,
    authors: String,
    slug: String,
    content: String
});

mongoose.model('BlogPost', BlogPostSchema);