const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require("morgan");
const mongoURI = 'mongodb+srv://kemal:R6fwa97DL0QzhXrF@ciklet.rk9ql0z.mongodb.net/';
const { ObjectId } = require('mongodb');

const app = express();
const port = 3000;
const db = mongoose.connection;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log(`connected`);
    app.listen(3000);
  }).catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/static/index.html"));
  console.log("connected")
});

const User = mongoose.model('User', {
  username: String,
  password: String,
  email: String,
  admin: Boolean,
  books: [Object],
  movies: [Object]
});
const Book = mongoose.model('Book', {
  title: String,
  author: String,
  genre: String,
  comments: [
    {
      commenterName: String,
      comment: String,
      rating: Number,
    }
  ]
});
const Movie = mongoose.model('Movie', {
  title: String,
  director: String,
  genre: String,
  comments: [
    {
      commenterName: String,
      comment: String,
      rating: Number,
    }
  ]
});
// const UserBook = mongoose.model()

// Middleware
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap-table/dist')))
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(express.static("static"))

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Routes
app.post('/addBookToList', async (req, res) => {
  try {
    const myObj = {
      _id: new ObjectId(),
      bookId: req.body.bookId,
      comment: req.body.comment,
      rating: req.body.rating,
      date: (new Date()).toISOString()
    }
    const userId = req.body.userId;
    const user = await User.findById(userId);
    const commentObj = {
      commenterName: user.username,
      comment: req.body.comment,
      rating: req.body.rating
    }
    const book = await Book.findOne({ _id: req.body.bookId });
    book.comments.push(commentObj);
    user.books.push(myObj);
    await user.save();
    await book.save();
    res.json({ message: 'Book successfully added to user list', user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/addMovieToList', async (req, res) => {
  try {
    const myObj = {
      _id: new ObjectId(),
      movieId: req.body.movieId,
      comment: req.body.comment,
      rating: req.body.rating,
      date: (new Date()).toISOString()
    }
    const userId = req.body.userId;
    const user = await User.findById(userId);
    const commentObj = {
      commenterName: user.username,
      comment: req.body.comment,
      rating: req.body.rating
    }
    const movie = await Movie.findOne({ _id: req.body.movieId });
    movie.comments.push(commentObj);
    user.movies.push(myObj);
    await user.save();
    await movie.save();
    res.json({ message: 'Movie successfully added to user list', user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/getUserBookCommentList', async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.body.userId;
    const user = await User.findOne({ _id: userId });
    res.json(user.books);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/getUserMovieCommentList', async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.body.userId;
    const user = await User.findOne({ _id: userId });
    res.json(user.movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/getBook', async (req, res) => {
  try {
    console.log(req.body.bookId)
    const bookId = req.body.bookId;
    const book = await Book.findOne({ _id: bookId });
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/getBooks', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/getMovie', async (req, res) => {
  try {
    console.log(req.body.movieId)
    const movieId = req.body.movieId;
    const movie = await Movie.findOne({ _id: movieId });
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/getMovies', async (req, res) => {
  try {
    const movies = await Movie.find();
    console.log(movies);
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/addBook', async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const newBook = new Book({ title, author, genre });
    await newBook.save();
    const books = await Book.find();
    res.json({ message: 'Book added successfully', books: books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post("/addMovie", async (req, res) => {
  try {
    const { title, director, genre } = req.body;
    const newMovie = new Movie({ title, director, genre });
    await newMovie.save();
    const movies = await Movie.find();
    res.json({ message: 'Movie added successfully', movies: movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post("/editMovie", async (req, res) => {
  try {
    const { title, director, genre, id } = req.body;
    const movie = await Movie.findById(id);
    movie.title = title;
    movie.director = director;
    movie.genre = genre;
    await movie.save();
    const movies = await Movie.find();
    res.json({ message: 'Movie edited successfully', movies: movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post("/editBook", async (req, res) => {
  try {
    const { title, author, genre, id } = req.body;
    const book = await Book.findById(id);
    book.title = title;
    book.author = author;
    book.genre = genre;
    await book.save();
    const books = await Book.find();
    res.json({ message: 'Book edited successfully', books: books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', authenticateUser, (req, res) => {
  res.json({ message: 'Login successful', user: req.user });
});

// Start the server

