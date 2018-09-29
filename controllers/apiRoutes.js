// Initializes Node.js Packages
var cheerio = require("cheerio");
var express = require("express");
var mongoose = require("mongoose");
var request = require("request");

// Initializes Counter
var count = 0;

// Requires Article Model
var db = require("../models");

// Connects MongoDB to Mongoose
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Sets Up Routing
var router = express.Router();

// Default Route to Display all News
router.get("/", function(req, res) {
    db.Article.find({ status: "unsaved" })
    .populate("notes")
    .then(function(data) {
        // Flipping Data Array to Show Recently Added News First
        var flop = [];

        for (var i = 0; i < data.length; i++) {
            flop[i] = data[data.length - 1 - i];
        }

        res.render("index", { news: flop });
    })
    .catch(function(err) {
        return res.json(err);
    });
});

// Default Route to Display Saved Articles
router.get("/saved", function(req, res) {
    db.Article.find({ status: "saved" })
    .populate("notes")
    .then(function(data) {
        res.render("index", { news: data });
    })
    .catch(function(err) {
        return res.json(err);
    });
});


// Pulls news from Miami New Times
router.get("/mnh", function(req, res) {
    var count = 0;
    var result = [];

    db.Article.find({})
    .then(function(data) {
        result = data;
    });

    request("https://www.miaminewtimes.com/topic/news-8094193", function(error, response, html) {

        if (error) {
            console.log(error);
        }

        var $ = cheerio.load(html);

        $("div.deets.ellipsis").each(function(i, element) {
            var flag = false;
            var title = $(element).children("div.headline").text();
            var url = $(element).children("div.headline").children("a").attr("href");
            var brief = $(element).children("p.ellipsis").children("p").text();
            
            if (url != undefined) {
                var urlsplit = url.substring(0,4);

                if (urlsplit == "http") {
                    flag = true;
                }
            }
        
            for (var i = 0; i < result.length; i++) {
                if (result[i].title == title) {
                    flag = true;
                }
            }

            if (title != "" && title != null && flag == false && url != undefined) {
                count++;

                var data = {
                    status: "unsaved",
                    title: title,
                    url: "https://www.miaminewtimes.com/" + url,
                    brief: brief,
                    source: "Miami New Times"
                };

                db.Article.create(data)
                .then(function(database) {
                    console.log(database);
                })
                .catch(function(err) {
                    return res.json(err);
                });
            }
        });
        console.log(count + " articles have been added.");
    });
});

// Pulls News from The Wall Street Journal
router.get("/wsj", function(req, res) {
    var count = 0;
    var result = [];

    db.Article.find({})
    .then(function(data) {
        result = data;
    });

    request("https://www.wsj.com/", function(error, response, html) {

        if (error) {
            console.log(error);
        }

        var $ = cheerio.load(html);

        $(".wsj-card").each(function(i, element) {
            var flag = false;
            var title = $(element).children(".wsj-headline").text();
            var url = $(element).children(".wsj-headline").children(".wsj-headline-link").attr("href");
            var brief = $(element).children(".wsj-card-body").children(".wsj-summary").text();
            
            for (var i = 0; i < result.length; i++) {
                if (result[i].title == title) {
                    flag = true;
                }
            }

            if (title != "" && title != null && flag == false) {
                count++;

                var data = {
                    status: "unsaved",
                    title: title,
                    url: url,
                    brief: brief,
                    source: "The Wall Street Journal"
                };

                db.Article.create(data)
                .then(function(database) {
                    console.log(database);
                })
                .catch(function(err) {
                    return res.json(err);
                });
            }
        });
        console.log(count + " Articles have been added.");
    });
});

// Pulls news from The Washington Post
router.get("/wp", function(req, res) {
    var count = 0;
    var result = [];

    db.Article.find({})
    .then(function(data) {
        result = data;
    });

    request("https://www.washingtonpost.com/", function(error, response, html) {

        if (error) {
            console.log(error);
        }

        var $ = cheerio.load(html);

        $("div.flex-item").each(function(i, element) {
            var flag = false;
            var title = $(element).children("div.headline").children("a").text();
            var url = $(element).children("div.headline").children("a").attr("href");
            var brief = $(element).children("div.blurb").text();
            
            for (var i = 0; i < result.length; i++) {
                if (result[i].title == title) {
                    flag = true;
                }
            }

            if (title != "" && title != null && flag == false) {
                count++;

                var data = {
                    status: "unsaved",
                    title: title,
                    url: url,
                    brief: brief,
                    source: "The Washington Post"
                };

                db.Article.create(data)
                .then(function(database) {
                    console.log(database);
                })
                .catch(function(err) {
                    return res.json(err);
                });
            }
        });
        console.log(count + " Articles have been added.");
    });
});

// Clears all Unsaved News Articles
router.get("/clear", function(req, res) {
    db.Article.remove({ status: "unsaved" }, function(error) {
        console.log("All articles have been removed.");
    });
});

// Saves One Article
router.post("/save/:id", function(req, res) {
    db.Article.findOneAndUpdate({_id: req.params.id}, {status: "saved"}, function(error) {
        console.log("Article has been saved.");
    });
});

// Removes One Article
router.post("/delete/:id", function(req, res) {
    db.Article.remove({_id: req.params.id}, function(error) {
        console.log("Article has been removed.");
    });
});

// Pulls All Notes for an Anticle
router.get("/notes/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("notes")
    .then(function(data) {
        console.log(data);
        res.json(data);
    })
    .catch(function(err) {
        return res.json(err);
    });
});

// Posts a note
router.post("/notes/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        console.log(dbNote);
        console.log("Note Added!");
        return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {notes: dbNote._id}}, {new: true})
    })
    .then(function(dbArticle) {
        console.log(dbArticle);
        res.json(dbArticle);
    })
    .catch(function(err) {
        return res.json(err);
    });
});

// Removes One Note
router.post("/delete/notes/:id", function(req, res) {
    db.Note.remove({_id: req.params.id}, function(error) {
        console.log("Note has been Removed.");
    });
});

// Exports Router
module.exports = router;