const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Route to get all purchase entries
router.get('/:adminId/getpurchaseentries', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.json(admin.purchase_entry);
    } catch (error) {
        console.error("Error fetching purchase entries:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to add a purchase entry
router.post('/:adminId/addpurchaseentry', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const {
            name, bill, order_number, bill_date, due_date, payment_type, item, note, recipt
        } = req.body;

        // Find the items in the Admin's item list by their IDs
        const selectedItems = admin.items.filter(adminItem => 
            item.some(reqItemId => reqItemId === adminItem._id.toString())
        );

        if (selectedItems.length === 0) {
            return res.status(404).json({ error: "No matching items found" });
        }

        // Map the selected items to include only `_id` and `name`
        const itemsToStore = selectedItems.map(selectedItem => ({
            _id: selectedItem._id,
            name: selectedItem.name,
        }));

        const newPurchaseEntry = {
            name,
            bill,
            order_number,
            bill_date,
            due_date,
            payment_type,
            item: itemsToStore,
            note,
            recipt,
        };

        admin.purchase_entry.push(newPurchaseEntry);
        await admin.save();

        res.status(201).json({ message: "Purchase entry added successfully", purchaseEntry: newPurchaseEntry });
    } catch (error) {
        console.error("Error adding purchase entry:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to edit a purchase entry
router.put('/:adminId/editpurchaseentry/:purchaseEntryId', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const {
            name, bill, order_number, bill_date, due_date, payment_type, item, note, recipt
        } = req.body;

        // Find the purchase entry by its ID
        const purchaseEntry = admin.purchase_entry.find(entry => entry._id.toString() === req.params.purchaseEntryId);

        if (!purchaseEntry) {
            return res.status(404).json({ error: "Purchase entry not found" });
        }

        // Find the items in the Admin's item list by their IDs
        const selectedItems = admin.items.filter(adminItem => 
            item.some(reqItemId => reqItemId === adminItem._id.toString())
        );

        if (selectedItems.length === 0) {
            return res.status(404).json({ error: "No matching items found" });
        }

        // Map the selected items to include only `_id` and `name`
        const itemsToStore = selectedItems.map(selectedItem => ({
            _id: selectedItem._id,
            name: selectedItem.name,
        }));

        // Update the purchase entry fields if provided
        purchaseEntry.name = name || purchaseEntry.name;
        purchaseEntry.bill = bill || purchaseEntry.bill;
        purchaseEntry.order_number = order_number || purchaseEntry.order_number;
        purchaseEntry.bill_date = bill_date || purchaseEntry.bill_date;
        purchaseEntry.due_date = due_date || purchaseEntry.due_date;
        purchaseEntry.payment_type = payment_type || purchaseEntry.payment_type;
        purchaseEntry.item = itemsToStore; // Store only `id` and `name` of each item
        purchaseEntry.note = note || purchaseEntry.note;
        purchaseEntry.recipt = recipt || purchaseEntry.recipt;

        // Save the updated admin document
        await admin.save();

        res.json({ message: "Purchase entry updated successfully", purchaseEntry });
    } catch (error) {
        console.error("Error updating purchase entry:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to delete a purchase entry
router.delete('/:adminId/deletepurchaseentry/:entryId', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const entryIndex = admin.purchase_entry.findIndex((entry) => entry._id.toString() === req.params.entryId);
        if (entryIndex === -1) {
            return res.status(404).json({ error: "Purchase entry not found" });
        }

        admin.purchase_entry.splice(entryIndex, 1);
        await admin.save();
        res.json({ message: "Purchase entry deleted successfully" });
    } catch (error) {
        console.error("Error deleting purchase entry:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;