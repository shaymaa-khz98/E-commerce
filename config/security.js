const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const morgan = require('morgan');

const csrfProtection = csrf({ cookie: true });

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true
};

module.exports = function applySecurityMiddleware(app) {
  // Logging in development
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`);
  }

  // Core Security Middleware
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json({ limit: '20kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('uploads'));
  app.use(compression());
  app.use(hpp({ whitelist: ['sort', 'fields'] }));
  app.use(xss());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api', limiter);

  // CSRF routes example (optional for reference)
  app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.status(200).json({ message: 'CSRF token set' });
  });

  app.post('/api/data', csrfProtection, (req, res) => {
    res.status(200).json({ message: 'CSRF verified ✅' });
  });
};
