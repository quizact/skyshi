const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

const moment = require('moment');

/**
 * INDEX POSTS
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM todo_items ORDER BY id desc LIMIT 10', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                "total": rows.length,
                "limit": 10,
                "skip": 0,
                "data": rows
            })
        }
    });
});

/**
 * STORE POST
 */
 router.post('/', [

    //validation
    body('title').notEmpty(),
    body('activity_group_id').notEmpty(),
    body('is_active').notEmpty(),
    body('priority').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        title: req.body.title,
        activity_group_id: req.body.activity_group_id,
        is_active: req.body.is_active,
        priority: req.body.priority,
    }

    // insert query
    connection.query('INSERT INTO todo_items SET ?', formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(201).json({
                "status": "Success",
                "message": "Success",
                "data": {
                    "id": rows.insertId,
                    "title": formData.title,
                    "activity_group_id": formData.activity_group_id,
                    "is_active": formData.is_active,
                    "priority" : formData.priority
                  }
            })
        }
    })

});

/**
 * UPDATE POST
 */
 router.patch('/:id', [

    //validation
    body('title').notEmpty(),
    body('activity_group_id').notEmpty(),
    body('is_active').notEmpty(),
    body('priority').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id post
    let id = req.params.id;

    //data post
    let formData = {
        title: req.body.title,
        activity_group_id: req.body.activity_group_id,
        is_active: req.body.is_active,
        priority: req.body.priority,
    }

    // update query
    connection.query(`UPDATE todo_items SET ? WHERE id = ${id}`, formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                "status": "Success",
                "message": 'Update Data Successfully!'
            })
        }
    })

});

/**
 * DELETE POST
 */
 router.delete('/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM todo_items WHERE id = ${id}`, function(err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully!',
            })
        }
    })
});

module.exports = router;