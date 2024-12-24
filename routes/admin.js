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

// route3 : Get customer by id using GET: "/api/admin/:clientId/getcustomer" login required
router.get('/:adminId/getcustomer', fetchuser, async (req, res) => {
    try {
        const admin = await Admin.findOne({ _id: req.params.adminId, user: req.user.id });
        if (!admin) {
            return res.status(404).json({ error: "admin not found" });
        }
        const customer = admin.customer;
        res.json(customer);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Add customer ROUTE: /api/admin/:id/addcustomer 
router.post('/:clientId/addcustomer', async (req, res) => {
    try {
        const client = await Admin.findById(req.params.clientId);
        if (!client) {
            return res.status(404).json({ error: "Category not found" });
        }

        const { type, name, displayName, companyName, email, phone, mobile } = req.body;

        client.customer.push({
            type,
            name,
            displayName,
            companyName,
            email,
            phone,
            mobile,
        });
        await client.save();

        res.status(201).json({ message: "customer added successfully" });
    } catch (error) {
        console.error("Error adding customer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add customer ROUTE: /api/admin/:id/editcustomer /:id
router.put('/:clientId/editcustomer/:customerId',
    async (req, res) => {
        try {
            // Find the client by clientId
            const client = await Admin.findById(req.params.clientId);
            if (!client) {
                return res.status(404).json({ error: "admin not found" });
            }

            // Destructure data from request body
            const { type, name, displayName, companyName, email, phone, mobile } = req.body;
            // Find the subcategory by subcategoryId
            const subcategory = client.customer.find(sub => sub._id.toString() === req.params.customerId);

            if (subcategory) {
                // Update the subcategory fields if new data is provided
                subcategory.type = type || subcategory.type;
                subcategory.name = name || subcategory.name;
                subcategory.displayName = displayName || subcategory.displayName;
                subcategory.companyName = companyName || subcategory.companyName;
                subcategory.email = email || subcategory.email;
                subcategory.phone = phone || subcategory.phone;
                subcategory.mobile = mobile || subcategory.mobile;

                // Save the updated client document
                await client.save();
                res.json({ message: "customer updated successfully" });
            } else {
                res.status(404).json({ error: "customer not found" });
            }
        } catch (error) {
            console.error("Error updating customer detail:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

// Delete customer ROUTE: /api/category/:clientId/subcategories/:subcategoryId
router.delete('/:clientId/subcategories/:subcategoryId', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId);
        if (!client) {
            return res.status(404).json({ error: "subcategory not found" });
        }

        const subcategoryIndex = client.subcategories.findIndex(sub => sub._id.toString() === req.params.subcategoryId);
        if (subcategoryIndex !== -1) {
            client.subcategories.splice(subcategoryIndex, 1);
            await client.save();
            res.json({ Success: "subcategory deleted successfully" });
        } else {
            res.status(404).json({ error: "subcategory not found" });
        }
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;