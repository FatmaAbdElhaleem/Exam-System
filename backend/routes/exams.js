const express = require("express");
const Exam = require("../models/Exam");
const Question = require("../models/Question");
const auth = require("../middleware/auth");
const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Access denied" });
  next();
};

router.get("/", auth, async (req, res) => {
  try {
    const exams = await Exam.find();
    console.log("Fetched exams:", exams); // Debugging
    res.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    console.log("Requested exam ID:", req.params.id); // Debugging
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      console.log("Exam not found for ID:", req.params.id); // Debugging
      return res.status(404).json({ msg: "Exam not found" });
    }
    console.log("Fetched exam:", exam); // Debugging
    res.json(exam);
  } catch (error) {
    console.error("Error fetching exam:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", auth, isAdmin, async (req, res) => {
  const { title, description } = req.body;
  try {
    const exam = new Exam({ title, description, createdBy: req.user.id });
    await exam.save();
    console.log("Created exam:", exam); // Debugging
    res.json(exam);
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/:examId/questions", auth, isAdmin, async (req, res) => {
  const { text, options } = req.body;
  try {
    const question = {
      _id: `q${Date.now()}`,
      text,
      options,
    };
    console.log(
      "Adding question to exam ID:",
      req.params.examId,
      "Question:",
      question
    ); // Debugging
    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ msg: "Exam not found" });
    exam.questions.push(question);
    await exam.save();
    console.log("Updated exam with question:", exam); // Debugging
    res.json(question);
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put(
  "/:examId/questions/:questionId",
  auth,
  isAdmin,
  async (req, res) => {
    const { text, options } = req.body;
    try {
      console.log(
        "Updating question ID:",
        req.params.questionId,
        "in exam ID:",
        req.params.examId
      ); // Debugging
      const exam = await Exam.findById(req.params.examId);
      if (!exam) return res.status(404).json({ msg: "Exam not found" });

      const question = exam.questions.id(req.params.questionId);
      if (!question) return res.status(404).json({ msg: "Question not found" });

      question.text = text || question.text;
      question.options = options || question.options;
      await exam.save();
      console.log("Updated question:", question); // Debugging
      res.json(question);
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.delete(
  "/:examId/questions/:questionId",
  auth,
  isAdmin,
  async (req, res) => {
    try {
      console.log(
        "Deleting question ID:",
        req.params.questionId,
        "from exam ID:",
        req.params.examId
      ); // Debugging
      const exam = await Exam.findById(req.params.examId);
      if (!exam) return res.status(404).json({ msg: "Exam not found" });

      const questionIndex = exam.questions.findIndex(
        (q) => q._id === req.params.questionId
      );
      if (questionIndex === -1)
        return res.status(404).json({ msg: "Question not found" });

      exam.questions.splice(questionIndex, 1);
      await exam.save();
      console.log("Deleted question from exam:", exam); // Debugging
      res.json({ msg: "Question deleted" });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.post("/:examId/submit", auth, async (req, res) => {
  const { answers } = req.body;
  try {
    console.log(
      "Submitting answers for exam ID:",
      req.params.examId,
      "Answers:",
      answers
    ); // Debugging
    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ msg: "Exam not found" });
    let score = 0;

    exam.questions.forEach((question, index) => {
      const selectedOption = answers[question._id];
      if (question.options[selectedOption]?.isCorrect) score++;
    });

    res.json({ score, total: exam.questions.length });
  } catch (error) {
    console.error("Error submitting exam:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, isAdmin, async (req, res) => {
  const { title, description } = req.body;
  try {
    console.log("Updating exam ID:", req.params.id, "with:", {
      title,
      description,
    }); // Debugging
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ msg: "Exam not found" });

    exam.title = title || exam.title;
    exam.description = description || exam.description;
    await exam.save();
    console.log("Updated exam:", exam); // Debugging
    res.json(exam);
  } catch (error) {
    console.error("Error updating exam:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    console.log("Deleting exam ID:", req.params.id); // Debugging
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ msg: "Exam not found" });
    console.log("Deleted exam:", exam); // Debugging
    res.json({ msg: "Exam deleted" });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:examId/results", auth, isAdmin, async (req, res) => {
  try {
    console.log("Fetching results for exam ID:", req.params.examId); // Debugging
    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ msg: "Exam not found" });
    console.log("Fetched exam for results:", exam); // Debugging
    res.json(exam);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
