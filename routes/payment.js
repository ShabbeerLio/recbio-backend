const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Route to get all items
router.get('/:adminId/getpayment', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.json(admin.payment);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to add a payment entry
router.post('/:adminId/addpayment', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const { type, name, invoice_number, invoise, payment_type, amount_received, amount,transaction, note } = req.body;

        const newPayment = {
            type,
            name,
            invoice_number,
            invoise,
            payment_type,
            amount_received,
            amount,
            transaction,
            note,
        };

        admin.payment.push(newPayment);
        await admin.save();

        res.status(201).json({ message: "Payment entry added successfully", payment: newPayment });
    } catch (error) {
        console.error("Error adding payment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to edit a payment entry
router.put('/:adminId/editpayment/:paymentId', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const payment = admin.payment.find(p => p._id.toString() === req.params.paymentId);
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        const { type, name, invoice_number, invoise, payment_type, amount_received, amount,transaction, note } = req.body;

        // Update fields if provided
        if (type !== undefined) payment.type = type;
        if (name !== undefined) payment.name = name;
        if (invoice_number !== undefined) payment.invoice_number = invoice_number;
        if (payment_type !== undefined) payment.payment_type = payment_type;
        if (amount_received !== undefined) payment.amount_received = amount_received;
        if (invoise !== undefined) payment.invoise = invoise;
        if (note !== undefined) payment.note = note;
        if (transaction !== undefined) payment.transaction = transaction;
        if (amount !== undefined) payment.amount = amount;

        await admin.save();
        res.json({ message: "Payment entry updated successfully", payment });
    } catch (error) {
        console.error("Error editing payment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to delete a payment entry
router.delete('/:adminId/deletepayment/:paymentId', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const paymentIndex = admin.payment.findIndex(p => p._id.toString() === req.params.paymentId);
        if (paymentIndex === -1) {
            return res.status(404).json({ error: "Payment not found" });
        }

        admin.payment.splice(paymentIndex, 1);
        await admin.save();

        res.json({ message: "Payment entry deleted successfully" });
    } catch (error) {
        console.error("Error deleting payment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;