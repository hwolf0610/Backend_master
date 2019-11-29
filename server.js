const express = require('express');
var nodemailer = require('nodemailer');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 3003;
let Job = require('./working.model');
let User = require('./todo.model');
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/reactUser', { useNewUrlParser: true });
mongoose.connect('mongodb://127.0.0.1:27017/job', { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

var transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'apexcup@outlook.com',
        pass: 'xincheng1201'
    }
});

todoRoutes.route('/add').post(function (req, res) {
    let user = new User(req.body);
    user.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });

            var mailOptions = {
                from: 'apexcup@outlook.com',
                to: user.email,
                subject: 'Congratulation! ',
                text: 'You signup in OUR TEAM! Your email address is <' + user.email + '> and your password is <' + user.password + '>.please login to OUR TEAM Site.'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + user.response);
                }
            });


        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/start').post(function (req, res) {

    let newUser = new User(req.body);

    User.find(function (err, user) {
        console.log("user start  ;", err, user);

        if (err) {
            console.log("error : ", err)
            res.status(200).json({ 'todo': 'failed' });
        } else {

            if (user.length == 0) {
                console.log("here length is", user.length);
                newUser.save()
                    .then(todo => {
                        res.status(200).json({ 'todo': 'todo added successfully' });

                            var mailOptions = {
                                from: 'apexcup@outlook.com',
                                to: newUser.email,
                                subject: 'Congratulation! ',
                                text: 'You signup in OUR TEAM! Your email address is <' + newUser.email + '> and your password is <' + newUser.password + '>.please login to OUR TEAM Site.'
                            };
                
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + newUser.response);
                                }
                            });
                    })
                    .catch(err => {
                        res.status(400).send('adding new todo failed');
                    });
            } else {

                res.status(200).json({ 'todo': 'todo added successfully' });

            }

        }

    }); 
});

todoRoutes.route('/userdelete/:id').delete(
    function (req, res) {
        let id = req.params.id;
        console.log(id);
        User.deleteOne({ _id: id }, function (err, user) {
            var mailOptions = {
                from: 'apexcup@outlook.com',
                to: user.email,
                subject: 'Alarm!',
                text: 'Your infomation was deleted by administrator!'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + user.response);
                }
            });

            res.json(user);
        })
    }
);

todoRoutes.route('/login').post(function (req, res) {
    User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
        if (err) {
            console.log("err->", err);
        } else {
            res.json(user);

        }
    });
});








todoRoutes.route('/').get(function (req, res) {
    //   console.log('request:  ', req);
    User.find(function (err, aa) {
        if (err) {
            console.log("err->", err);
        } else {
            res.json(aa);

        }
    });
});

todoRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    User.findById(id, function (err, user) {
        res.json(user);
    });
});


todoRoutes.route('/update/:id').post(function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (!user)
            res.status(404).send("data is not found");
        else
            user.email = req.body.email;
        user.password = req.body.password;

        user.save().then(todo => {
            res.json('Todo updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/workdelete/:id').delete(
    function (req, res) {
        let id = req.params.id;
        console.log(id);
        Job.deleteOne({ _id: id }, function (err, job) {
            res.json(job);
        })
    }
);

todoRoutes.route('/userdelete/:id').delete(
    function (req, res) {
        let id = req.params.id;
        console.log(id);
        User.deleteOne({ _id: id }, function (err, user) {
            res.json(user);
        })
    }
);

todoRoutes.route('/jobadd').post(function (req, res) {
    console.log("request : ", req.body)
    let job = new Job(req.body);
    job.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/getchart').post(function (req, res) {
    // db.users.find({"name":"Jack"},{"age":1})

    Job.find(function (err, job) {
        if (err) {
            console.log("err->", err);
        } else {
            res.json(job);

        }
    });
});

todoRoutes.route('/jobshow').post(function (req, res) {
    Job.find(function (err, job) {
        if (err) {
            console.log("err->", err);
        } else {
            res.json(job);

        }
    });
});

todoRoutes.route('/working').post(function (req, res) {
    let job = new Job(req.body);
    job.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/show').post(function (req, res) {

    User.find(function (err, user) {
        // db.user.distinct('name'); 
        console.log(user.name);
        if (err) {
            console.log("err->", err);
        } else {
            res.json(user);

        }
    });
});

todoRoutes.route('/showdistinct').post(function (req, res) {
    User.find(function (err, user) {
        // db.User.distinct('name'); 
        console.log(user.name);
        if (err) {
            console.log("err->", err);
        } else {
            res.json(user);

        }
    });
});

// todoRoutes.route('/add').post(function (req, res) {
//     let user = new User(req.body);
//     user.save()
//         .then(todo => {
//             res.status(200).json({ 'todo': 'todo added successfully' });
//         })
//         .catch(err => {
//             res.status(400).send('adding new todo failed');
//         });
// });





todoRoutes.route('/login').post(function (req, res) {
    User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
        if (err) {
            console.log("err->", err);
        } else {
            res.json(user);

        }
    });
});
app.use('/todos', todoRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});