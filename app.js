const express = require('express');
const cookieParser = require('cookie-parser');
const postsRouter = require('./routes/posts.js');
const usersRouter = require('./routes/users.js');
const commentsRouter = require('./routes/comments.js');
const app = express();
const port = 3018;
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', [postsRouter, usersRouter, commentsRouter]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
