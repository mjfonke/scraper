const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");
const logger = require("morgan");


const db = require("./models");

const  PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(express.static("public"))

mongoose.connect(MONGODB_URI, { useNewUrlParser: true});

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// ==============================================================
//                     ROUTES
// ==============================================================


app.get("/", function(req, res) {
    db.Article.find({saved: false }, function(err, result) {
        if (err) throw err;
        res.render("index", { result })
    })
});

app.get("/articles", function (req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    }) 
    .catch(function(err) {
        res.json(err);
    })
});

app.get("/scrape", function(req, res) {
    axios.get("https://www.nytimes.com/section/world").then(function(response) {
        const $ = cheerio.load(response.data);
        
        $("a").each(function(i, element) {
            const result = {}
            const address = "https://www.nytimes.com"
            result.title = $(element).children("h2").text();
            result.link = address + $(element).attr("href");
            result.summary = $(element).children("p").text();

            db.Article.create(result)
            .then(function(dbArticle) {
                res.render("index", { dbArticle });
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            })
        });
        res.send("Scrape Complete!")
    })
});

app.get("/saved", function (req, res) {
    db.Article.find({saved: true})
    .populate("note")
    .then(function (dbArticle) {
        res.render("saved", { dbArticle });
        console.log(dbArticle)
    })
    .catch(function(err) {
        res.json(err)
    })
});

app.put("/saved/:id", function(req, res) {
    db.Article.updateOne({ _id: req.params.id }, { $set: {saved: true}})
    .then(function(data) {
        console.log(data);
        res.json(data)
    })
    .catch(function(err) {
        res.json(err)
    })
});


app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id:req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.render(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    })
});

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id}, {note: dbNote._id}, {new: true});
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err)
    })
});

app.put("/delete/:id", function(req, res) {
    db.Article.updateOne({ _id: req.params.id }, { $set: {saved: false}})
    .then(function(data) {
        console.log(data);
        res.json(data)
    })
    .catch(function(err) {
        res.json(err)
    })
});

app.delete("/delete", function (req, res) {
    db.Article.remove({saved: false})
    .catch(function(err) {
        console.log(err)
    });
});

// ===============================
//          SERVER
// ===============================

app.listen(PORT, function() {
    console.log("App is listening on port: " + PORT);
});