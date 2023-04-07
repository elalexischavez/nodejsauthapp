const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  return (users.find(user => user.username === username)) ? true : false;
}


const authenticatedUser = (username, password) => {
  let flag;
  if (users.find(user => user.username === username && user.password === password)) {
    flag = true;
  }
  return flag;
}



// Add a book review
regd_users.patch("/auth/review/:isbn", (req, res) => {

  /*
    REVIEW OBJECT FORMAT SHOULD LOOKS LIKE:
    {
      author: "John Doe",
      rating: 1-10,
      review: "This is a great book"
    }  
  */

  const isbn = req.params.isbn;
  const userreview = req.body;
  const { username } = req.session.authorization;
  const review = {
    ...userreview,
    user: username
  }
  const bookToUpdate = books[isbn];
  const reviewsLength = Object.keys(bookToUpdate.reviews).length;
  const book = {
    ...bookToUpdate,
    reviews: {
      ...bookToUpdate.reviews,
      [reviewsLength+1]: review
    }
  }
  books[isbn] = book;
  return res.json({message:"Review added successfully by user " + username});
});


regd_users.delete("/auth/reviewremove/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { username } = req.session.authorization;
  const bookToUpdate = books[isbn];
  const reviews = bookToUpdate.reviews;
  const newReviews = {};
  for (let review in reviews) {
    if (reviews[review].user !== username) {
      newReviews[review] = reviews[review];
    }
  }
  const book = {
    ...bookToUpdate,
    reviews: newReviews
  }
  books[isbn] = book;
  return res.json({message:"Review deleted successfully by user " + username});
});

// Modify a book review
// regd_users.patch("/auth/review/:isbn", (req, res) => {
//   const book = req.body;
//   const bookToBeUpdated = books.find(book => book.isbn === req.params.isbn);

// });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;