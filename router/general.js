const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const book = req.body;
  const booksLength = Object.keys(books).length;
  books[booksLength+1] = book;
  return res.status(200).json({ message: "Book added successfully" });
});


// Get all books – Using async callback function (2 pts)
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  
  
  
  
  
  books = Object.keys(books).map((key) => ({
    title: books[key].title,
    author: books[key].author,
    reviews: books[key].reviews
  }))
  return res.status(200).json(books);
});




// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // get isbn from params
  const isbn = req.params.isbn;
  const book = books[isbn];
  // evaluate if book exists
  if (!book) {
    return res.status(401).json({ message: "Book not found" });
  }
  return res.status(200).json({book})
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;
  let newbook = {};
  for (let book in books) {
    if (books[book].author === author) {
      newbook = books[book]
    }
  }
  console.log(newbook);
  return res.status(200).json(newbook);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;
  let newbook = {};
  for (let book in books) {
    if (books[book].title === title) {
      newbook = books[book]
    }
  }
  return res.status(200).json(newbook);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;
  const { review } = books[isbn];
  return res.status(200).json({review});
});

module.exports.general = public_users;
