const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ text: String, isCorrect: Boolean }],
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
});

module.exports = mongoose.model("Question", questionSchema);
