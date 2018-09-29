// Initializes Node.js Package
var mongoose = require("mongoose");

// Initializes Schema
var Schema = mongoose.Schema;

// Creates Article Schema
var ArticleSchema = new Schema({
    status: {
        type: String,
        required: true,
        default: "unsaved"
    },
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    brief: {
        type: String,
        required: false,
        trim: true
    },
    source: {
        type: String,
        required: true
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// Creates Article Model
var Article = mongoose.model("Article", ArticleSchema);

// Exports Article Model
module.exports = Article;
