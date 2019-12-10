const express = require('express');
var nodemailer = require('nodemailer');
var billing_email = require('express-email')(__dirname + '/email/billing');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 3003;
let Job = require('./working.model');
let Plan = require('./plan.model');
let User = require('./todo.model');
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/reactUser', { useNewUrlParser: true });
mongoose.connect('mongodb://127.0.0.1:27017/plan', { useNewUrlParser: true });
mongoose.connect('mongodb://127.0.0.1:27017/job', { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

var transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'hwolf0610@outlook.com',
        pass: 'xingcheng1201'
    }
});

todoRoutes.route('/add').post(function (req, res) {
    let user = new User(req.body);
    user.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });
            // preview
            if (app.get('env') === 'development') {
                var locals = { activation_code: '000000-0000-00000000-000000-00000000' };
                app.get('/_mail/billing', billing_email.preview(locals));
            }

            // render
            app.get('/sendBilling', function (req, res, next) {
                // ...
                var locals = { activation_code: '000000-0000-00000000-000000-00000000' };
                billing_email.render(locals, function (err, result) {
                    // result.html
                    // result.text
                    // result.attachments
                    transporter.sendEmail({
                        from: "hwolf0610@outlook.com",
                        to: user.email,
                        subject: "Congratulation",
                        html: '<h1>Welcome</h1><p>That was easy!</p><p>Your email address is <' + user.email + '> and your password is <' + user.password + '>.please login to OUR TEAM Site</P>',
                        text: "Thank.",
                        attachments: result.attachments
                    });
                });
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

                        // preview
                        if (app.get('env') === 'development') {
                            var locals = { activation_code: '000000-0000-00000000-000000-00000000' };
                            app.get('/_mail/billing', billing_email.preview(locals));
                        }

                        // render
                        app.get('/sendBilling', function (req, res, next) {
                            // ...
                            var locals = { activation_code: '000000-0000-00000000-000000-00000000' };
                            billing_email.render(locals, function (err, result) {
                                // result.html
                                // result.text
                                // result.attachments
                                transporter.sendEmail({
                                    from: "hwolf0610@outlook.com",
                                    to: newUser.email,
                                    subject: "Congratulation",
                                    html: '<h1>Welcome</h1><p>That was easy!</p><p>Your email address is <' + newUser.email + '> and your password is <' + newUser.password + '>.please login to OUR TEAM Site</P>',
                                    text: "Thank.",
                                    attachments: result.attachments
                                });
                            });
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

// todoRoutes.route('/start').post(function (req, res) {

//     let newUser = new User(req.body);

//     User.find(function (err, user) {
//         console.log("user start  ;", err, user);

//         if (err) {
//             console.log("error : ", err)
//             res.status(200).json({ 'todo': 'failed' });
//         } else {

//             if (user.length == 0) {
//                 console.log("here length is", user.length);
//                 newUser.save()
//                     .then(todo => {
//                         res.status(200).json({ 'todo': 'todo added successfully' });

//                         var mailOptions = {
//                             from: 'hwolf0610@outlook.com',
//                             to: user.email,
//                             subject: 'Congratulation!',
//                             html: '<h1>Welcome</h1><p>That was easy!</p><p>Your email address is <' + user.email + '> and your password is <' + user.password + '>.please login to OUR TEAM Site</P>'
//                         };

//                         transporter.sendMail(mailOptions, function (error, info) {
//                             if (error) {
//                                 console.log(error);
//                             } else {
//                                 console.log('Email sent: ' + newUser.response);
//                             }
//                         });
//                     })
//                     .catch(err => {
//                         res.status(400).send('adding new todo failed');
//                     });
//             } else {

//                 res.status(200).json({ 'todo': 'todo added successfully' });

//             }

//         }

//     });
// });

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
todoRoutes.route('/login').post(function (req, res) {
    User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
        if (err) {
            console.log("err->", err);
        } else {
            res.json(user);

        }
    });
});

todoRoutes.route('/userupdate/:id').post(function (req, res) {
    let id = req.url.split('/')[2]
    console.log("req :", id)
    
    User.findById(id, function (err, doc) {
        if (err)console.log("err ; ", err)
        // doc.name = 'jason bourne';
        console.log("doc : ", doc)
        doc.name = req.body.name;
        doc.birthday = req.body.birthday ;
        doc.email = req.body.email;
        doc.address = req.body.address ;
        doc.password = req.body.password;
        doc.save(()=>{
            res.send("sccesss")
        });
      });
    //   User.findByIdAndUpdate(id, req.body);
});

todoRoutes.route('/plandelete/:id').delete(
    function (req, res) {
        let id = req.params.id;
        console.log(id);
        Plan.deleteOne({ _id: id }, function (err, plan) {
            res.json(plan);
        })
    }
);

todoRoutes.route('/planadd').post(function (req, res) {
    console.log("request : ", req.body)
    let plan = new Plan(req.body);
    plan.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

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

todoRoutes.route('/getJobchart').post(function (req, res) {
    // db.users.find({"name":"Jack"},{"age":1})

    Job.find(function (err, job) {
        if (err) {
            console.log("err->", err);
        } else {
            res.json(job);

        }
    });
});

todoRoutes.route('/getPlanchart').post(function (req, res) {
    // db.users.find({"name":"Jack"},{"age":1})

    Plan.find(function (err, plan) {
        if (err) {
            console.log("err->", err);
        } else {
            res.json(plan);

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

todoRoutes.route('/showplan').post(function (req, res) {

    Plan.find(function (err, plan) {
        // db.user.distinct('name'); 
        console.log(plan.name);
        if (err) {
            console.log("err->", err);
        } else {
            res.json(plan);

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

todoRoutes.route('/addplan').post(function (req, res) {
    let newplan = new Plan(req.body);
    Plan.find(function (err, plan) {
        console.log("user start  ;", err, plan);
        if (err) {
            console.log("error : ", err)
            res.status(200).json({ 'todo': 'failed' });
        } else {
            if (plan.length == 0) {
                console.log("here length is", plan.length);
                newplan.save()
                    .then(todo => {
                        res.status(200).json({ 'todo': 'todo added successfully' });
                    })
                    .catch(err => {
                        res.status(400).send('adding new todo failed');
                    });
            } else {
                Plan.findOne({ name: req.body.name, month: req.body.month, year: req.body.year }, function (err, plan2) {
                    if (err) {
                        console.log("err->", err);
                    } else {
                        // plan2.price = req.body.price;
                        Plan.findByIdAndUpdate(plan2.id, {price: req.body.price}, (err1, res1)=>{
                            if(err1)
                                console.log("err ; ", err1)
                            else{
                                console.log("update data : ", res1)
                                res.status(200).json(res1)
                            }

                        })
                        
                        // plan2.save()
                        //     .then(todo => {
                        //         res.json('Todo updated!');
                        //     })
                        //     .catch(err => {
                        //         res.status(400).send("Update not possible");
                        //     });


                    }


                });
            }
        }
    });
});

// todoRoutes.route('/addplan').post(function (req, res) {
//     console.log("request : ", req.body)
//     let plan = new Plan(req.body);
//     plan.save()
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