const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  book_img: {
    type: String,
    required: false,
    default: ""
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["sermon", "finance", "true_life", "motivational", "hymns", "class"],
    required: true
  },
  Chapters: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chapter"
    }
  ]
});

const Book = mongoose.model("Book", bookSchema);
