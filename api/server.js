// BUILD YOUR SERVER HERE
const express = require('express');

const server = express();
server.use(express.json());

const User = require('../api/users/model');



//gets all users
server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({
                message: 'error finding users',
                err: err.message,
                stack: err.stack,
            });
        })
});

//gets user by id
server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({message: 'user with that id does not exist'});
            } else {
                res.json(user);
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'error finding user',
                err: err.message,
                stack: err.stack,
            })
        })
});

//posts new user
server.post('/api/users', (req, res) => {
    const newUser = req.body;
    if (!newUser.name || !newUser.bio) {
        res.status(400).json({message: 'please provide name and bio for the user'});
    } else {
        User.insert(newUser)
            .then(createdUser => {
                res.status(201).json(createdUser);
            })
            .catch(err => {
                res.status(500).json({
                    message: 'error creating new user',
                    err: err.message,
                    stack: err.stack,
                })
            })
    }
});

//edits existing user
server.put('/api/users/:id', (req, res) => {
    const updates = req.body
    if (!updates.name || !updates.bio) {
        res.status(400).json({message: 'please provide name and bio for the user'})
    } else {
    User.update(req.params.id, updates)
        .then(updatedUser => {
            if (!updatedUser) {
                res.status(404).json({message: 'The user with the specified id does not exist'});
            } else {
                res.json(updatedUser);
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'the user information could not be modified',
                err: err.message,
                stack: err.stack
            });
        })}
})

//deletes a user
server.delete('/api/users/:id', (req, res) => {
    User.remove(req.params.id)
        .then(deletedUser => {
            if (!deletedUser) {
                res.status(404).json({message: 'the user with the specified id does not exist'});
            } else {
                res.json(deletedUser);
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'the user could not be removed',
                err: err.message,
                stack: err.stack,
            })
        })
})

//fallback
server.use('*', (req, res) => {
    res.status(404).json({message: 'not found'});
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
