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
    connection.query('SELECT * FROM activity_group ORDER BY id desc LIMIT 1000', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                "total": rows.length,
                "limit": 1000,
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
    body('email').notEmpty()

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
        email: req.body.email,
        created_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    }

    // insert query
    connection.query('INSERT INTO activity_group SET ?', formData, function (err, rows) {
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
                    "created_at": formData.created_at,
                    "updated_at" : null,
                    "id": rows.insertId,
                    "title": formData.title,
                    "email": formData.email
                  }
            })
        }
    })

});

/**
 * SHOW POST
 */
 router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT activity_group.id, activity_group.title, activity_group.created_at, todo_items.id as idtodo, todo_items.title as titletodo, todo_items.activity_group_id, todo_items.is_active,todo_items.priority FROM activity_group, todo_items WHERE activity_group.id = ? and activity_group.id = todo_items.activity_group_id`, [id], function (err, rows) {

        if (err) {
            console.log(err);
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if post not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Post Not Found!',
            })
        }
        // if post found
        else {
            var a = [];
            rows.forEach(function(item,index) {
                var b = {
                "id" : item.id,
                "title": item.title,
                "created_at": item.created_at,
                "todo_items" : [{
                    "id" : item.idtodo,
                    "title" : item.titletodo,
                    "activity_group_id" : item.activity_group_id,
                    "is_active" : item.is_active,
                    "priority" : item.priority
                }]
            }
            a.push(b);
        })
              console.log('Finish');
            return res.status(200).json(a);
            }
        })
})

/**
 * EMAIL PARAMETER
 */
 router.get('/', function (req, res) {

    let email = req.params.email;

    res.send({
        'email': email
      });

    connection.query(`SELECT todo_items.id, todo_items.title, todo_items.created_at FROM activity_group, todo_items WHERE activity_group.email = ? and activity_group.id = todo_items.activity_group_id`, [email], function (err, rows) {

        if (err) {
            console.log(err);
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if post not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Post Not Found!',
            })
        }
        // if post found
        else {
            var a = [];
            rows.forEach(function(item,index) {
                var b = {
                "id" : item.id,
                "title": item.title,
                "created_at": item.created_at,
            }
            a.push(b);
        })
              console.log('Finish');
            return res.status(200).json(a);
            }
        })
})

/**
 * UPDATE POST
 */
 router.patch('/update/:id', [

    //validation
    body('email').notEmpty(),
    body('title').notEmpty()

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
        email: req.body.email,
        title: req.body.title,
        updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    }

    // update query
    connection.query(`UPDATE activity_group SET ? WHERE id = ${id}`, formData, function (err, rows) {
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
     
    connection.query(`DELETE FROM activity_group WHERE id = ${id}`, function(err, rows) {
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