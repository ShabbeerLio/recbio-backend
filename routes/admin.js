const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
var fetchuser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

// route1 : Get all category using GET: "/api/admin/fetchalldata" login required
router.get('/fetchalldata', fetchuser, async (req, res) => {
    try {
        const clients = await Admin.find({ user: req.user.id });
        res.json(clients);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// route2 : Add new category using POST: "/api/admin/addadmin" login required
router.post('/addadmin', fetchuser, [
    body('category', 'Enter a valid category').isLength({ min: 3 }),
], async (req, res) => {
    try {
        const { category } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const Category = new Admin({
            category,
            user: req.user.id
        });
        const savedCategory = await Category.save();
        res.json(savedCategory);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;