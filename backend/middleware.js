// middleware.js
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config();

const configureMiddleware = (app) => {
  // JSON Body Parser Middleware
  app.use(express.json());

  // CORS Middleware
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );

  // Session Middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
      }),
      cookie: { maxAge: 24 * 60 * 60 * 1000 },
    })
  );
  // Serve static files
  app.use('/uploads', express.static('uploads'));
};

module.exports = configureMiddleware;
