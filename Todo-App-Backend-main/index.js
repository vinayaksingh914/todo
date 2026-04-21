const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname)));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.use(cors());
app.use(bodyParser.json());

// Dummy user
const users = [{ username: "Dewang Mishra", password: "9371" }];

// Todo storage
let todos = [];

//  LOGIN API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  )

  if (user) {
    res.json({
      success: true,
      token: "mytoken123",
    });
  } else {
    res.json({
      success: false,
      message: "Invalid credentials",
    });
  }
});

//  GET TODOS
app.get("/todos", (req, res) => {
  if (req.headers.authorization !== "mytoken123") {
    return res.status(401).send("Unauthorized");
  }

  res.json(todos);
});

//  ADD TODO
app.post("/todos", (req, res) => {
  if (req.headers.authorization !== "mytoken123") {
    return res.status(401).send("Unauthorized");
  }

  const { task } = req.body;

  const newTodo = {
    id: Date.now(),
    task,
  };

  todos.push(newTodo);

  res.json({
    message: "Todo added",
    todo: newTodo,
  });
});

//  DELETE TODO
app.delete("/todos/:id", (req, res) => {
  if (req.headers.authorization !== "mytoken123") {
    return res.status(401).send("Unauthorized");
  }

  const id = parseInt(req.params.id);

  todos = todos.filter((t) => t.id !== id);

  res.json({ message: "Deleted successfully" });
});

//  UPDATE TODO
app.put("/todos/:id", (req, res) => {
  if (req.headers.authorization !== "mytoken123") {
    return res.status(401).send("Unauthorized");
  }

  const id = parseInt(req.params.id);
  const { task } = req.body;

  todos = todos.map((t) => (t.id === id ? { ...t, task } : t));

  res.json({ message: "Updated successfully" });
});

//  SERVER START
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
