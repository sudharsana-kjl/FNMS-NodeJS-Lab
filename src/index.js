"use strict";

var express = require("express");
var pg = require("pg");
var PORT = process.env.PORT || 3000;
var client = new pg.Client({
    password: "postgres",
    user: "postgres",
    host: "postgres",
});
var app = express();


app.get("/ping", async (req, res) => {
  const database = await client.query("SELECT 1 + 1").then(() => "up").catch(() => "down");

  res.send({
    environment: process.env.NODE_ENV,
    database,
  });
});

app.get("/tasks", async (req, res) => {

  const tasks = await client.query("SELECT * FROM todolist").then((result) =>
    result.rows).catch((error) => error);

  res.send({tasks});

});

app.get("/tasks/:id", async (req, res) => {

  const id = parseInt(req.params.id)

  const tasks = await client.query("SELECT * FROM todolist WHERE id = $1", [id]).then((result) =>
    result.rows).catch((error) => error);

  res.send({tasks});

});

app.post("/tasks", async (req, res) => {

  const taskName = req.query.taskName
  const taskDesc = req.query.taskDesc

  const tasks = await client.query("INSERT INTO todolist (taskName, taskDesc) VALUES ($1, $2)", [taskName, taskDesc]).then((result) =>
    "Task added").catch((error) => error);

  res.send({tasks});

});


app.put("/tasks/:id", async (req, res) => {

  const id = parseInt(req.params.id)
  const taskName = req.query.taskName
  const taskDesc = req.query.taskDesc

  const tasks = await client.query("UPDATE todolist SET taskName = $1, taskDesc = $2 WHERE id = $3",
    [taskName, taskDesc, id]).then((result) =>
    "Task modified").catch((error) => error);

  res.send({tasks});

});

app.delete("/tasks/:id", async (req, res) => {

  const id = parseInt(req.params.id)

  const tasks = await client.query("DELETE FROM todolist WHERE id = $1", [id]).then((result) =>
    "Task deleted").catch((error) => error);

  res.send({tasks});

});


(async () => {
  await client.connect();

  app.listen(PORT, () => {
    console.log("Started at http://localhost:%d", PORT);
  });
})();