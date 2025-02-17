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

// Route to add a purchase entry and auto-generate the bill number
router.post('/:adminId/addpurchaseentry', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const {
            name, order_number, bill_date, due_date, payment_type, invoice_number, items, discount, total, note, terms, recipt
        } = req.body;

        // Generate the purchase bill number with the "PE" prefix
        const billNumber = `#PE${admin.purchase_bill_counter.toString().padStart(6, '0')}`;  // Bill number like #PE000001

        // Create the new purchase entry
        const newPurchaseEntry = {
            name,
            bill: billNumber,  // Use generated bill number
            order_number,
            bill_date,
            due_date,
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
            terms,
            recipt,
        };

        // Add the purchase entry
        admin.purchase_entry.push(newPurchaseEntry);

        // Increment the purchase bill counter for the next purchase entry
        admin.purchase_bill_counter += 1;

        // Save the admin document
        await admin.save();

        res.status(201).json({
            message: "Purchase entry added successfully",
            purchaseEntry: newPurchaseEntry,
        });
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
            name, bill, order_number, bill_date, due_date, invoice_number, payment_type, items, discount, total, note,terms, recipt
        } = req.body;

        // Update the purchase entry
        purchaseEntry.name = name || purchaseEntry.name;
        purchaseEntry.bill = bill || purchaseEntry.bill;
        purchaseEntry.order_number = order_number || purchaseEntry.order_number;
        purchaseEntry.bill_date = bill_date || purchaseEntry.bill_date;
        purchaseEntry.due_date = due_date || purchaseEntry.due_date;
        purchaseEntry.invoice_number = invoice_number || purchaseEntry.invoice_number;
        purchaseEntry.payment_type = payment_type || purchaseEntry.payment_type;
        purchaseEntry.discount = discount || purchaseEntry.discount;
        purchaseEntry.total = total || purchaseEntry.total;
        purchaseEntry.note = note || purchaseEntry.note;
        purchaseEntry.terms = terms || purchaseEntry.terms;
        purchaseEntry.recipt = recipt || purchaseEntry.recipt;

        if (items) {
            purchaseEntry.item = items.map(({ name, quantity, rate, tax, mfg, exp, amount }) => ({
                name,
                quantity,
                rate,
                tax,
                mfg,
                exp,
                amount,
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