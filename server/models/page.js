const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pageSchema = new Schema({
  page: {
    type: String,
    trim: true
  },
  number: {
    type: Number,
    default: 1
  },
  date: { type: Date, default: Date.now }
});

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
