const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },

    link: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required:true
    },

    saved: {
        type: Boolean,
        required: true,
        default: false
    },

    date: {
        type: Date,
        default: Date.now
    },

    note: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
    

});

const Article = mongoose.model("Articles", ArticleSchema);

module.exports = Article