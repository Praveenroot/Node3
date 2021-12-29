const mysql = require('mysql');


//Connection pool
// const pool = mysql.createPool({
//     connectionLimit: 100,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.DB_NAME
// });

const pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "",
    database: "usermng"
});



// View Users
exports.view = (req, res) => {

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // Not Connected!
        console.log('connected as ID' + connection.threadId);

        //User the Connection
        connection.query('SELECT * FROM user', (err, rows) => {
            //When done with the Connection, release
            connection.release();

            if (!err) {
                res.render('home', { rows });
            } else {
                console.log(err);
            }

            console.log('The data from user table:\n', rows);
        });

    });

}


//Find user by search
exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; // Not Connected!
        console.log('connected as ID' + connection.threadId);
        let searchTerm = req.body.search;
        //User the Connection
        connection.query('SELECT * FROM user WHERE first_name LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
            //When done with the Connection, release
            connection.release();
            if (!err) {

            } else {
                console.log(err);
            }
            console.log('The data from user table:\n', rows);
        });
    });
}


exports.form = (req, res) => {
    res.render('add-user');
}

//Add user
exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err; // Not Connected!
        console.log('connected as ID' + connection.threadId);

        //User the Connection
        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
            //When done with the Connection, release
            connection.release();

            if (!err) {
                res.render('add-user', { alert: 'User Added Successfully' });
            } else {
                console.log(err);
            }

            console.log('The data from user table:\n', rows);
        });

    });
}


//Edit user:
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as ID' + connection.threadId);

        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release();
            if (!err) {
                res.render('edit-user', { rows });
            } else {
                console.log(err);
            }
            console.log('The data from user table:\n', rows);
        });
    });
}


//Update User:
exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err; // Not Connected!
        console.log('connected as ID' + connection.threadId);

        //User the Connection
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?,comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
            //When done with the Connection, release
            connection.release();

            if (!err) {

                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    console.log('connected as ID' + connection.threadId);

                    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
                        connection.release();
                        if (!err) {
                            res.render('edit-user', {
                                rows,
                                alert: `${first_name} has been updated`
                            });
                        } else {
                            console.log(err);
                        }
                        console.log('The data from user table:\n', rows);
                    });
                });

            } else {
                console.log(err);
            }

            console.log('The data from user table:\n', rows);
        });

    });

}

//Delete User
exports.delete = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as ID' + connection.threadId);

        connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release();
            if (!err) {
                let removedUser = encodeURIComponent('User Successfully Removed')
                res.redirect('/?removed=' + removedUser);
            } else {
                console.log(err);
            }
            console.log('The data from user table:\n', rows);
        });
    });

}


// View Users
exports.viewall = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as ID' + connection.threadId);

        //User the Connection
        connection.query('SELECT * FROM user WHERE ID = ?', [req.params.id], (err, rows) => {
            //When done with the Connection, release
            connection.release();
            if (!err) {
                res.render('view-user', { rows });
            } else {
                console.log(err);
            }
            console.log('The data from user table:\n', rows);
        });
    });
}