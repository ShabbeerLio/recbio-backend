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

router.post('/:adminId/addpurchaseentry', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const {
            name, bill, order_number, bill_date, due_date, hsn, batch, payment_type, invoice_number,items, discount, total, note, recipt
        } = req.body;

        const newPurchaseEntry = {
            name,
            bill,
            order_number,
            bill_date,
            due_date,
            hsn,
            batch,
            payment_type,
            invoice_number,
            item: items.map(({ name, quantity, rate, tax, mfg, exp, price }) => ({
                name,
                quantity,
                rate,
                tax,
                mfg,
                exp,
                price
            })),
            discount,
            total,
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

        const purchaseEntry = admin.purchase_entry.find(entry => entry._id.toString() === req.params.purchaseEntryId);
        if (!purchaseEntry) {
            return res.status(404).json({ error: "Purchase entry not found" });
        }

        const {
            name, bill, order_number, bill_date, due_date, hsn, batch,invoice_number, payment_type, items, discount, total, note, recipt
        } = req.body;

        // Update the purchase entry
        purchaseEntry.name = name || purchaseEntry.name;
        purchaseEntry.bill = bill || purchaseEntry.bill;
        purchaseEntry.order_number = order_number || purchaseEntry.order_number;
        purchaseEntry.bill_date = bill_date || purchaseEntry.bill_date;
        purchaseEntry.due_date = due_date || purchaseEntry.due_date;
        purchaseEntry.hsn = hsn || purchaseEntry.hsn;
        purchaseEntry.batch = batch || purchaseEntry.batch;
        purchaseEntry.invoice_number = invoice_number || purchaseEntry.invoice_number;
        purchaseEntry.payment_type = payment_type || purchaseEntry.payment_type;
        purchaseEntry.discount = discount || purchaseEntry.discount;
        purchaseEntry.total = total || purchaseEntry.total;
        purchaseEntry.note = note || purchaseEntry.note;
        purchaseEntry.recipt = recipt || purchaseEntry.recipt;

        if (items) {
            purchaseEntry.item = items.map(({ name, quantity, rate, tax, mfg, exp, amount }) => ({
                name,
                quantity,
                rate,
                tax,
                mfg,
                exp,
                amount
            }));
        }

        await admin.save();
        res.json({ message: "Purchase entry updated successfully", purchaseEntry });
    } catch (error) {
        console.error("Error editing purchase entry:", error);
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