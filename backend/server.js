const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quizify",
});

db.connect((err) => {
  if (err) throw err;
  console.log("worked");
});

app.get("/categories", (req, res) => {
  const query = "SELECT * FROM categories";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(result);
  });
});

app.get(`/categories/:id`, (req, res) => {
  const categoryId = parseInt(req.params.id, 10);

  const query = `SELECT * FROM questions WHERE categoryId = ${categoryId}`;
  db.query(query, [categoryId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Category could not found" });
    }
    res.json(result);
  });
});

app.post("/api/createquiz", (req, res) => {
  const { quizTitle, questions } = req.body;

  const insertQuizQuery = "INSERT INTO custom_quizzes (title) VALUES (?)";
  db.query(insertQuizQuery, [quizTitle], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Adding Quiz Error: " + err.message });
    }

    const quizId = result.insertId;
    const insertQuestionQuery =
      "INSERT INTO custom_quizzes_questions (quiz_id, question_text, correct_answer) VALUES (?, ?, ?)";

    questions.forEach((question) => {
      db.query(
        insertQuestionQuery,
        [quizId, question.questionText, question.correctAnswer],
        (err, questionResult) => {
          if (err) {
            console.error("Adding question error", err);
            return;
          }

          const questionId = questionResult.insertId;
          const insertOptionQuery =
            "INSERT INTO custom_quizzes_questions_options (question_id, option_text, option_order) VALUES (?, ?, ?)";

          question.options.forEach((option, index) => {
            db.query(insertOptionQuery, [questionId, option, index], (err) => {
              if (err) {
                console.error("Adding option error", err);
              }
            });
          });
        }
      );
    });

    res.status(201).json({ message: "Quiz added succesfully!" });
  });
});

app.get("/api/getcustomquiz", (req, res) => {
  const quizQuery = "SELECT * FROM custom_quizzes";
  db.query(quizQuery, (err, result) => {
    if (err) {
      console.error("Getting custom quiz error", err);
    }

    res.json(result);
  });
});

app.get("/api/getcustomquiz/:id", (req, res) => {
  const quizId = parseInt(req.params.id, 10);

  const query = `SELECT * FROM custom_quizzes_questions qq 
    LEFT JOIN custom_quizzes_questions_options qo ON qq.id = qo.question_id 
    WHERE qq.quiz_id = ${quizId}
    ORDER BY qq.id, qo.option_order`;

  db.query(query, [quizId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Getting custom quiz error: " + err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "$$$$$$$$$$$$$$$$$$$$$$$$$" });
    }

    const formattedResponse = {
      quizId: quizId,
      questions: [],
    };

    const questionsMap = new Map();

    result.forEach((row) => {
      if (!row.question_id) return;

      if (!questionsMap.has(row.question_id)) {
        questionsMap.set(row.question_id, {
          questionId: row.question_id,
          questionText: row.question_text,
          correctAnswer: row.correct_answer,
          options: [],
        });
      }

      if (row.option_text) {
        const question = questionsMap.get(row.question_id);
        question.options[row.option_order] = row.option_text;
      }
    });

    formattedResponse.questions = Array.from(questionsMap.values()).map(
      (question) => {
        return {
          ...question,
          options: question.options.filter(
            (option) => option !== null && option !== undefined
          ),
        };
      }
    );

    res.json(formattedResponse);
  });
});

app.listen(port, () => {
  console.log("server running");
});
