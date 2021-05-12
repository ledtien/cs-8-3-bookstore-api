const { query } = require("express");
var express = require("express");
var router = express.Router();
var fs = require("fs");

let usersData;

function readUsersData() {
  fs.readFile(`${__dirname}/users.json`, "utf8", function (err, data) {
    if (err) throw err;
    usersData = JSON.parse(data);
  });
}
readUsersData();

function save(data) {
  const json = JSON.stringify(data);
  fs.writeFile("./routes/users.json", json, function (err) {
    if (err) return console.log(err);
  });
}

router.get("/", function (req, res, next) {
  try {
    res.json(usersData);
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Users not found" });
  }
});

router.post("/", function (req, res, next) {
  try {
    const users = usersData;
    let user = req.body;
    if (!user) throw Error;
    user.id = users.length + 1;
    users.push(user);
    save(users);
    res.json(user);
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Users not found" });
  }
});

router.get("/:id", function (req, res, next) {
  try {
    user = usersData.find((u) => u.id === req.params.id);
    if (!user) throw Error;
    res.json(user);
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Users not found" });
  }
});

router.patch("/:id", function (req, res, next) {
  const { id } = req.params;
  try {
    user = usersData.find((u) => u.id === id);
    if (!user) throw Error;
    user = {
      ...user,
      ...req.body,
    };
    let idx = usersData.findIndex((u) => u.id === id);
    usersData[idx] = user;
    save(usersData);
    res.json(user);
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Users not found" });
  }
});

router.delete("/:id", function (req, res, next) {
  const { id } = req.params;
  try {
    let idx = usersData.findIndex((u) => u.id === id);
    if (!idx) throw Error;
    usersData.splice(idx, 1);
    save(usersData);
    res.json("User just deleted");
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Users not found" });
  }
});

router.get("/search", function (req, res, next) {
  const { email } = req.query;
  try {
    // if (query) {
    //   const users = usersData.filter((u) => u.email === email);
    //   console.log({ users });
    //   res.json("Hello");
    // }
    res.send("Hello");
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Users not found" });
  }
});
module.exports = router;
