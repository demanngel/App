const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const url = require('url');
const app = express();
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const i18n = require('i18n');
const port = 3500;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'vidoe/mp4',
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.orf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

function staticFile(res, filePath, ext) {
  res.setHeader('content-type', mimeTypes[ext]);

  fs.readFile(path.join('../public', filePath), (error, data)=> {
    if(error) {
      res.statusCode = 404;
      res.end();
    }
    res.end(data);
  });

}

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());
require('./middleware/passport')(passport);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'../public/views'));

// i18n.configure({
//   locales: ['en', 'ru'],
//   defaultLocale: 'en',
//   cookie: 'lang',
//   directory: __dirname + '/locales',
//   objectNotation: true,
//   queryParameter: 'lang',
// });

// app.use(i18n.init);

const routes = require('../settings/routes');
const { request } = require('http');
routes(app);

app.listen(port, ()=>{
  console.log(`App listen on port ${port}`);
}); 