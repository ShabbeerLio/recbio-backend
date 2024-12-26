const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
var fetchuser = require('../middleware/fetchUser');

// Get vandor route
router.get('/:adminId/getvandor', fetchuser, async (req, res) => {
    try {
        const admin = await Admin.findOne({ _id: req.params.adminId, user: req.user.id });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.json(admin.vandor);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Add vandor route
router.post('/:clientId/addvandor', async (req, res) => {
    try {
        const client = await Admin.findById(req.params.clientId);
        if (!client) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const { name, displayName, companyName, email, phone, mobile,other, address, remark } = req.body;

        client.vandor.push({
            name,
            displayName,
            companyName,
            email,
            phone,
            mobile,
            other,
            address,
            remark
        });
        await client.save();

        res.status(201).json({ message: "vandor added successfully" });
    } catch (error) {
        console.error("Error adding vandor:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update vandor route
router.put('/:clientId/editvandor/:vandorId', async (req, res) => {
    try {
        const client = await Admin.findById(req.params.clientId);
        if (!client) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const { type, name, displayName, companyName, email, phone, mobile, address, remark } = req.body;

        const customer = client.vandor.find(cust => cust._id.toString() === req.params.vandorId);
        if (!customer) {
            return res.status(404).json({ error: "vandor not found" });
        }

        // Update the customer fields if new data is provided
        customer.name = name || customer.name;
        customer.displayName = displayName || customer.displayName;
        customer.companyName = companyName || customer.companyName;
        customer.email = email || customer.email;
        customer.phone = phone || customer.phone;
        customer.mobile = mobile || customer.mobile;
        customer.address = address || customer.address;
        customer.remark = remark || customer.remark;

        await client.save();
        res.json({ message: "vandor updated successfully" });
    } catch (error) {
        console.error("Error updating vandor:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete customer route
router.delete('/:clientId/deletevandor/:vandorId', async (req, res) => {
    try {
        const client = await Admin.findById(req.params.clientId);
        if (!client) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const customerIndex = client.vandor.findIndex(cust => cust._id.toString() === req.params.vandorId);
        if (customerIndex !== -1) {
            client.vandor.splice(customerIndex, 1);
            await client.save();
            res.json({ message: "vandor deleted successfully" });
        } else {
            res.status(404).json({ error: "vandor not found" });
        }
    } catch (error) {
        console.error("Error deleting vandor:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;