const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

router.get('/todos', (req, res, next) => {
    // This will return all the data, exposing only the id and action field to the client
    Todo.find({}, 'action')
        .then((data) => res.json(data))
        .catch(next);
});

router.post('/todos', (req, res, next) => {
    if (req.body && typeof req.body.action === 'string' && req.body.action.trim().length > 0) {
        Todo.create({ action: req.body.action.trim() })
            .then((data) => res.status(201).json(data))
            .catch(next);
    } else {
        res.status(400).json({
            error: 'The action field is required and cannot be empty',
        });
    }
});

router.delete('/todos/:id', (req, res, next) => {
    Todo.findByIdAndDelete(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.json(data);
        })
        .catch(next);
});

module.exports = router;