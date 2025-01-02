const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
var fetchuser = require('../middleware/fetchUser');

// Get customers route
router.get('/:adminId/getcustomer', fetchuser, async (req, res) => {
    try {
        const admin = await Admin.findOne({ _id: req.params.adminId, user: req.user.id });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.json(admin.customer);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Add customer route
router.post('/:clientId/addcustomer', async (req, res) => {
    try {
        const client = await Admin.findById(req.params.clientId);
        if (!client) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const { type, name, displayName, companyName, email, phone, mobile,other, address, remark } = req.body;

        client.customer.push({
            type,
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

        res.status(201).json({ message: "Customer added successfully" });
    } catch (error) {
        console.error("Error adding customer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update customer route
router.put('/:clientId/editcustomer/:customerId', async (req, res) => {
    try {
        const client = await Admin.findById(req.params.clientId);
        if (!client) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const { type, name, displayName, companyName, email, phone, mobile,other, address, remark } = req.body;

        const customer = client.customer.find(cust => cust._id.toString() === req.params.customerId);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Update the customer fields if new data is provided
        customer.type = type || customer.type;
        customer.name = name || customer.name;
        customer.displayName = displayName || customer.displayName;
        customer.companyName = companyName || customer.companyName;
        customer.email = email || customer.email;
        customer.phone = phone || customer.phone;
        customer.mobile = mobile || customer.mobile;
        customer.other = other || customer.other;
        customer.address = address || customer.address;
        customer.remark = remark || customer.remark;

        await client.save();
        res.json({ message: "Customer updated successfully" });
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete customer route
router.delete('/:clientId/deletecustomer/:customerId', async (req, res) => {
    try {
        const client = await Admin.findById(req.params.clientId);
        if (!client) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const customerIndex = client.customer.findIndex(cust => cust._id.toString() === req.params.customerId);
        if (customerIndex !== -1) {
            client.customer.splice(customerIndex, 1);
            await client.save();
            res.json({ message: "Customer deleted successfully" });
        } else {
            res.status(404).json({ error: "Customer not found" });
        }
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;