const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import axios
const axios = require('axios');

const moment = require('moment');

/**
 * GET DATA
 */
router.get('/', function (req, res) {
        axios.get(`https://floating-mountain-35184.herokuapp.com/activity-groups`)
        .then(respon => {
        res.send(respon.data);
        })        
});

router.get('/(:id)', function (req, res) {
    let id = req.params.id;
    axios.get(`https://floating-mountain-35184.herokuapp.com/activity-groups/${id}`)
    .then(respon => {
    res.send(respon.data);
    })        
});

module.exports = router;