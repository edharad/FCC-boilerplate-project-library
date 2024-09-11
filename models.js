const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookSchema = new Schema({
    comments: {type : [String], default: []},
    title: {type: String, required: true},
    commentcount: {type: Number, default: 0},
    //__v: {type: Number}
})

const Book = mongoose.model("Book", BookSchema)

exports.Book = Book;