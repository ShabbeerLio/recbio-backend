const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Route to get all items
router.get('/:adminId/getitems', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.json(admin.items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to add an item
router.post('/:adminId/additem', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const { name, unit, tax, hsn, selling_price, cost_price, description, mfr_name, gst } = req.body;

        // Create new item
        const newItem = {
            name,
            unit,
            tax,
            hsn,
            selling_price,
            cost_price,
            description,
            mfr_name,
            gst,
        };

        admin.items.push(newItem);
        await admin.save();

        res.status(201).json({ message: "Item added successfully", item: newItem });
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to update an item
router.put('/:adminId/edititem/:itemId', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const { name, unit, tax, hsn, selling_price, cost_price, description, mfr_name, gst } = req.body;

        const item = admin.items.find((i) => i._id.toString() === req.params.itemId);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        // Update item fields if provided
        item.name = name || item.name;
        item.unit = unit || item.unit;
        item.tax = typeof tax === 'boolean' ? tax : item.tax;
        item.hsn = hsn || item.hsn;
        item.selling_price = selling_price || item.selling_price;
        item.cost_price = cost_price || item.cost_price;
        item.description = description || item.description;
        item.mfr_name = mfr_name || item.mfr_name;
        item.gst = gst || item.gst;

        await admin.save();
        res.json({ message: "Item updated successfully", item });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to delete an item
router.delete('/:adminId/deleteitem/:itemId', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const itemIndex = admin.items.findIndex((i) => i._id.toString() === req.params.itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: "Item not found" });
        }

        admin.items.splice(itemIndex, 1);
        await admin.save();

        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;