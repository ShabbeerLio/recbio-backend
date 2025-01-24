const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Route to get all organisation
router.get('/:adminId/getorganisation', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.json(admin.organisation);
    } catch (error) {
        console.error("Error fetching organisation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to add an organisation
router.post('/:adminId/addorganisation', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const { name,description,phone,mobile,invoice,dlnumber, gst, location, state, street1, street2, city, zip_code } = req.body;

        // Create new item
        const newItem = {
            name,
            description,
            phone,
            mobile,
            invoice,
            dlnumber,
            gst,
            location,
            state,
            street1,
            street2,
            city,
            zip_code
        };

        admin.organisation.push(newItem);
        await admin.save();

        res.status(201).json({ message: "organisation added successfully", item: newItem });
    } catch (error) {
        console.error("Error adding organisation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to update an organisation
router.put('/:adminId/editorganisation/:itemId', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const {name,description, gst,phone,mobile,invoice,dlnumber, location, state, street1, street2, city, zip_code  } = req.body;

        const item = admin.organisation.find((i) => i._id.toString() === req.params.itemId);
        if (!item) {
            return res.status(404).json({ error: "organisation not found" });
        }

        // Update item fields if provided
        item.name = name || item.name;
        item.description = description || item.description;
        item.phone = phone || item.phone;
        item.mobile = mobile || item.mobile;
        item.invoice = invoice || item.invoice;
        item.dlnumber = dlnumber || item.dlnumber;
        item.location = location || item.location;
        item.state = state || item.state;
        item.street1 = street1 || item.street1;
        item.street2 = street2 || item.street2;
        item.city = city || item.city;
        item.zip_code = zip_code || item.zip_code;
        item.gst = gst || item.gst;

        await admin.save();
        res.json({ message: "organisation updated successfully", item });
    } catch (error) {
        console.error("Error updating organisation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to delete an organisation
router.delete('/:adminId/deleteorganisation/:itemId', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const itemIndex = admin.organisation.findIndex((i) => i._id.toString() === req.params.itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: "organisation not found" });
        }

        admin.organisation.splice(itemIndex, 1);
        await admin.save();

        res.json({ message: "organisation deleted successfully" });
    } catch (error) {
        console.error("Error deleting organisation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;