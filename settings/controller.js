'use strict'
const response = require('./response');
const db = require('./db');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

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

exports.homepage = (req, res) => {
    staticFile(res, '/homepage.html', '.html');
}

exports.userhomepage = (req, res) => {
    staticFile(res, '/userhomepage.html', '.html');
}

exports.adminhomepage = (req, res) => {
    staticFile(res, '/adminhomepage.html', '.html');
}

exports.multi = (req, res) => {
    const url = req.url;
    const extname = String(path.extname(url)).toLocaleLowerCase();
    if(extname in mimeTypes) {
      staticFile(res, url, extname);
    } else {
      res.statusCode = 404;
      res.end;
    }
}

exports.signup = (req, res) => {
    const user = req.body;
    var sql = "select id from user where email = ?";

    db.query(sql, user.email, (error, rows, fields) => {
        if(error) {
            response.status(400, error, res);
        } else if (typeof rows !== 'undefined' && rows.length > 0) {
            console.log(rows);
            const row = JSON.parse(JSON.stringify(rows));
            rows.map(rw => {
                response.status(302, {message: "Позователь с такой почтой уже существует"}, res);
                return true;
            })
        } else {
            
            const hashpassword = bcrypt.hashSync(user.password, 10);
            sql = "insert into user (username, email, password) values(?, ?, ?)";
            db.query(sql, [user.username, user.email, hashpassword], (error, results) => {
                if(error) {
                    response.status(400, error, res);
                } else {
                    res.redirect('/');
                    //response.status(200, results, res);
                }
            })

        }
    })
}

exports.signin = (req, res) => {

    const sql = "SELECT id, email, password, type FROM user where email = ?";
    db.query(sql, req.query.email, (error, rows, fields) => {
        if(error) {
            response.status(400, error, res);
        } else if (rows.length <=0) {
            response.status(404, 'Пользователь не найден', res);
        } else {
            const row = JSON.parse(JSON.stringify(rows));
            row.map(rw => {
                const password = bcrypt.compareSync(req.query.password, rw.password);
                if(password) {
                    const token = jwt.sign({
                        userId: rw.id,
                        email: rw.email,
                        type: rw.type
                    }, 'lips for u', {expiresIn: 120 * 120});

                    res.cookie('jwt', token, {httpOnly: true, secure: false});
                    
                    if(rows.type=='admin') {
                        res.redirect('/admin');
                    } else {
                        res.redirect('/user');
                    }
                    
                } else {

                    response.status(401, "Пароль не верный", res);

                }
                return true;  
            })

            
        }
    })
}

exports.logout = (req, res) => {
    res.cookie('jwt', '', { expires: new Date(0) });
    res.redirect('/');
}
exports.profile = (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, 'lips for u');
    const id = decoded.userId;
    const sql = "select * from user join profile on user.id = profile.id where user.id = ?";
    db.query(sql, id, (err, results) => {
        if (err) {
        console.error('Ошибка при выполнении запроса: ', err);
        res.status(500).send('Internal Server Error');
        return;
        }
        res.render('userprofile', { profileData: results[0]});
    });
}

exports.products = (req, res) => {
    const sql = 'SELECT * FROM product';

    db.query(sql, (error, results) => {
    if (error) throw error;

    res.render('products', { products: results });
  });

}

exports.userproducts = (req, res) => {
    const sql = 'SELECT * FROM product';

    db.query(sql, (error, results) => {
    if (error) throw error;

    res.render('userproducts', { products: results });
  });

}

exports.toBag= (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, 'lips for u');
    const id_u = decoded.userId;

    console.log(id_u);
    console.log(req.body.id);
    var sql = "insert into bag (id_u, id_p) values (?, ?)";

    db.query(sql, [id_u, req.body.id], (error, rows, fields) => {
        if (error) {
            console.error('Ошибка при выполнении запроса: ', err);
            res.status(500).send('Internal Server Error');
            return;
        }
    })
    res.redirect('/userproducts');
}

exports.productsBag = (req, res) => {

    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, 'lips for u');
    const id_u = decoded.userId;

  // Запрос к базе данных для получения товаров из корзины пользователя
    const sql = `SELECT * FROM product JOIN bag ON product.id = bag.id_p WHERE bag.id_u = ?`;

    db.query(sql, [id_u], (error, results) => {
    if (error) throw error;
    //console.log(results);
    // Отправка данных товаров в корзине в представление EJS
    res.render('bag', { cartItems: results });
  });

}

exports.aboutus = (req, res) => {
    staticFile(res, '/aboutus.html', '.html');
}

exports.useraboutus = (req, res) => {
    staticFile(res, '/useraboutus.html', '.html');
}

exports.payprod = (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, 'lips for u');
    const id_u = decoded.userId;
    const orders = req.body.products;
    const bag = req.body.pbag;
    console.log(bag);
    [orders].forEach(item => {
        var sql = "insert into orders (id_u, id_p) values ('"+id_u+"' , ?)";
        db.query(sql, item, (error, rows, fields) => {
            if (error) {
                console.error('Ошибка при выполнении запроса: ', error);
                res.status(500).send('Internal Server Error');
                return;
            }
        })  
    });
    [bag].forEach(function(item) {
    var sql = "delete from bag where id = ?";
        db.query(sql, item, (error, rows, fields) => {
            if (error) {
                console.error('Ошибка при выполнении запроса: ', error);
                res.status(500).send('Internal Server Error');
                return;
            }
        })
    });
    res.redirect('/bag');
}

exports.delprod = (req, res) => {
    const bag = req.body.pbag;
    console.log(bag);
    
    [bag].forEach(function(item) {
    var sql = "delete from bag where id = ?";
        db.query(sql, item, (error, rows, fields) => {
            if (error) {
                console.error('Ошибка при выполнении запроса: ', error);
                res.status(500).send('Internal Server Error');
                return;
            }
        })
    });
    res.redirect('/bag');
}

exports.orders = (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, 'lips for u');
    const id_u = decoded.userId;
    const sql = `SELECT * FROM product JOIN orders ON product.id = orders.id_p WHERE orders.id_u = ?`;
    db.query(sql, id_u, (error, results) => {
    if (error) throw error;
    res.render('orders', { cartItems: results });
  });
}

exports.adminusers = (req, res) => {

  const sql = `SELECT * FROM users`;

    db.query(sql, (error, results) => {
    if (error) throw error;
    //console.log(results);
    // Отправка данных товаров в корзине в представление EJS
    res.render('adminusers', { users: results });
  });

}