const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
  number: {
    type: Number,
    default: 1
  },
  title: {
    type: String,
    trim: true
  },
  pages: {
    type: Schema.Types.ObjectId,
    ref: "Page"
  },
  date: { type: Date, default: Date.now }
});

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;
