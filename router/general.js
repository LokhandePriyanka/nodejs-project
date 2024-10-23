const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


//Using Async-Await with Axios
//To get the list of books available in the shop as done in Task 1 using Axios with either Promise callbacks or async-await
async function getBooksUsingAsyncAwait() {
  try {
    const response = await axios.get('/');
    console.log('Books:', response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

//Using Promise Callbacks with Axios
function getBookDetailsByISBN(isbn) {
  axios.get(`/isbn/${isbn}`) 
    .then(response => {
      console.log('Book Details:', response.data);
    })
    .catch(error => {
      console.error('Error fetching book details:', error);
    });
}

//Using Async-Await with Axios
async function getBookDetailsByAuthorAsync(author) {
  try {
    const response = await axios.get(`/author/${author}`); 
    console.log('Books by Author:', response.data);
  } catch (error) {
    console.error('Error fetching books by author:', error);
  }
}

//Using Promise Callbacks with Axios
function getBookDetailsByTitle(title) {
  axios.get(`/title/${encodeURIComponent(title)}`)
    .then(response => {
      console.log('Books by Title:', response.data);
    })
    .catch(error => {
      console.error('Error fetching books by title:', error);
    });
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  let booksByAuthor = [];

  // Convert books object to array if it's not already an array
  const booksArray = Array.isArray(books) ? books : Object.values(books);

  booksArray.forEach(book => {
    if (book.author === authorName) {
      booksByAuthor.push(book);
    }
  });

  res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksByTitle = [];

  // Adapt this according to whether 'books' is an array or an object
  const booksArray = Array.isArray(books) ? books : Object.values(books);

  booksArray.forEach(book => {
    if (book.title === title) {
      booksByTitle.push(book);
    }
  });

  res.json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  // Find the book by using the isbn as a key in the 'books' object
  const book = books[isbn];

  if (book && book.reviews) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: 'No reviews found for this ISBN' });
  }
});

module.exports.general = public_users;
