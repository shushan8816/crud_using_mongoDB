const express = require("express");
const bp = require("body-parser");
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const app = express();

app.use(bp.json());
app.use(bp.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017');

const UserSchema = new schema({
    name: String,
    age: Number
});

const User = mongoose.model('user', UserSchema);

app.post('/users', (req, res) => {

    const user = new User({
        name: req.body.name,
        age: req.body.age
    });

    user.save(function (err) {
        if (err) {
            res.send(err)
        }
        res.send("Data saved")
    });
});
app.get('/users', (req, res) => {

    User.find({}, function (err, docs) {
        if (err) {
            res.send(err)
        }
        res.send(docs)
    });
});

app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id, function (err, doc) {
        if (err) {
            res.send(err)
        }
        res.send(doc)
    });
});

app.put('/user/:id', (req, res) => {
    const newUser = {
        name: req.body.name,
        age: req.body.age
    }
    const id = req.body.id;
    User.findByIdAndUpdate(id, newUser, function (err, user) {
        if (err) {
            res.send(err)
        }
        res.send(user)
    });
});

app.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id, function (err, doc) {
        if (err) {
            res.send(err)
        }
        res.send(doc)
    });
});


const PostSchema = new schema({
    title: String,
    description: String,
    user_id: schema.Types.ObjectId
});

const Post = mongoose.model('post', PostSchema)

app.post('/posts', (req, res) => {

    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        userID: schema.Types.ObjectId
    });

    post.save().then(post => {
            res.send(post);
        }, (err) => {
            res.status(400).send(err);
        }
    );
});

app.get('/post/:id', (req, res) => {

    const id = req.params.userID;
    Post.findById(id, function (err, doc) {
        if (err) {
            res.send(err)
        }
        res.send(doc)
    });
});

app.put('/post/:id', (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        userID: schema.Types.ObjectId
    });
    const post_id = req.params.id;
    const userID = schema.Types.ObjectId
    Post.findByIdAndUpdate(post_id, newPost, function (err, doc) {
        if (err) {
            res.send(err)
        }
        if (doc.userID.toString() !== userID.toString()) {
            res.send('Only the author/user of this post can update it!')
        }
        res.send(doc)
    });
});

app.delete('/post/:id', (req, res) => {

    const post_id = req.params.id;
    const userID = schema.Types.ObjectId
    Post.findByIdAndDelete(post_id, function (err, post) {
        if (err) {
            res.send(err)
        }
        if (post.userID.toString() !== userID.toString()) {
            res.send('Only the author/user of this post can delete it!')
        }
        res.send(post)
    });
});


const port = 4000;

app.listen(port, () =>
    console.log(`Server started on port ${port}`));

