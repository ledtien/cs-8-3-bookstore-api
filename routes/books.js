var express = require("express");
var router = express.Router();
var fs = require("fs");

let booksData;

function readBooksData() {
  fs.readFile(`${__dirname}/db.json`, "utf8", function (err, data) {
    if (err) throw err;
    booksData = JSON.parse(data);
  });
}
readBooksData();

function save(data) {
  const json = JSON.stringify(data);
  fs.writeFile("./routes/db.json", json, function (err) {
    if (err) return console.log(err);
  });
}

router.get("/", function (req, res, next) {
  const { books } = booksData;
  try {
    res.send(books);
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Books not found" });
  }
});

router.get("/:bookId", function (req, res, next) {
  const { books } = booksData;
  try {
    const book = books.find((b) => b.id === req.params.bookId);
    if (!book) throw Error;
    res.send(book);
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Book not found" });
  }
});

router.patch("/:bookId", function (req, res, next) {
  const { books } = booksData;
  try {
    const { bookId } = req.params;
    let book = books.find((b) => b.id === bookId);
    if (!book) throw Error;
    book = {
      ...book,
      ...req.body,
    };
    const idx = books.findIndex((b) => b.id === bookId);
    books[idx] = book;
    save(booksData);
    res.send(book);
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Book not found" });
  }
});

router.delete("/:bookId", function (req, res, next) {
  const { books } = booksData;
  const { bookId } = req.params;
  try {
    let idx = books.findIndex((b) => b.id === bookId);
    if (!idx) throw Error;
    books.splice(idx, 1);
    save(booksData);

    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Book not found" });
  }
});

router.post("/", function (req, res, next) {
  const { books } = booksData;

  try {
    const book = req.body;
    if (!book) throw Error;
    let newId = Math.random().toString(36).substring(3);
    book.id = newId;
    books.push(book);
    save(booksData);
    res.send(book);
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Book not found" });
  }
});

module.exports = router;
