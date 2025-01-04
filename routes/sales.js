const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Route to get all sales entries
router.get('/:adminId/getsalesentries', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.json(admin.sales_entry);
    } catch (error) {
        console.error("Error fetching purchase entries:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//  Route to add a sales entry
router.post('/:adminId/addsalesentries', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const {
            name, bill, order_number, invoice_number, salesperson, bill_date, due_date, payment_type, items,discount,total, note, terms
        } = req.body;

        const newSalesEntry = {
            name,
            bill,
            order_number,
            invoice_number,
            salesperson,
            bill_date,
            due_date,
            payment_type,
            item: items.map(({ name, quantity, rate, tax, price }) => ({
                name,
                quantity,
                rate,
                tax,
                price
            })),
            discount,
            total,
            note,
            terms,
        };

        admin.sales_entry.push(newSalesEntry);
        await admin.save();

        res.status(201).json({ message: "Sales entry added successfully", salesEntry: newSalesEntry });
    } catch (error) {
        console.error("Error adding Sales entry:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to edit a sales entry
router.put('/:adminId/editsalesentries/:salesEntryId', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const salesEntry = admin.sales_entry.find(entry => entry._id.toString() === req.params.salesEntryId);
        if (!salesEntry) {
            return res.status(404).json({ error: "Sales entry not found" });
        }

        const {
            name, bill, order_number, invoice_number, salesperson, bill_date, due_date, payment_type, items,discount,total, note, terms
        } = req.body;

        // Update the purchase entry
        salesEntry.name = name || salesEntry.name;
        salesEntry.bill = bill || salesEntry.bill;
        salesEntry.order_number = order_number || salesEntry.order_number;
        salesEntry.invoice_number = invoice_number || salesEntry.invoice_number;
        salesEntry.salesperson = salesperson || salesEntry.salesperson;
        salesEntry.bill_date = bill_date || salesEntry.bill_date;
        salesEntry.due_date = due_date || salesEntry.due_date;
        salesEntry.payment_type = payment_type || salesEntry.payment_type;
        salesEntry.discount = discount || salesEntry.discount;
        salesEntry.total = total || salesEntry.total;
        salesEntry.note = note || salesEntry.note;
        salesEntry.terms = terms || salesEntry.terms;

        if (items) {
            salesEntry.item = items.map(({ name, quantity, rate, tax, amount }) => ({
                name,
                quantity,
                rate,
                tax,
                amount
            }));
        }

        await admin.save();
        res.json({ message: "Sales entry updated successfully", salesEntry });
    } catch (error) {
        console.error("Error editing sales entry:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to delete a purchase entry
router.delete('/:adminId/deletesalesentries/:entryId', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const entryIndex = admin.sales_entry.findIndex((entry) => entry._id.toString() === req.params.entryId);
        if (entryIndex === -1) {
            return res.status(404).json({ error: "Sales entry not found" });
        }

        admin.sales_entry.splice(entryIndex, 1);
        await admin.save();
        res.json({ message: "sales entry deleted successfully" });
    } catch (error) {
        console.error("Error deleting Sales entry:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;