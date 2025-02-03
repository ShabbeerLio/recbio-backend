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

        const { type, name, invoice_number, invoise, payment_type, amount_received, total, amount, transaction, note, date } = req.body;

        // Find invoice entries in sales_entry or purchase_entry using the invoice_number from invoise field
        let invoiceEntry;
        let entryType;
        let remainingAmount = amount_received; // To track remaining amount to be deducted

        // Loop through invoise array to find matching invoice_number and subtract payments
        for (const inv of invoise) {
            if (type === "customer") {
                invoiceEntry = admin.sales_entry.find(entry => entry.invoice_number === inv.invoice_number);
                entryType = "sales_entry";
            } else if (type === "vendor") {
                invoiceEntry = admin.purchase_entry.find(entry => entry.invoice_number === inv.invoice_number);
                entryType = "purchase_entry";
            }

            if (!invoiceEntry) {
                continue; // Skip this invoice if it was not found
            }

            // Subtract the remaining payment amount from invoice totals
            while (remainingAmount > 0 && invoiceEntry.total > 0) {
                const paymentAmount = Math.min(remainingAmount, invoiceEntry.total);
                invoiceEntry.total -= paymentAmount;
                remainingAmount -= paymentAmount;

                if (invoiceEntry.total === 0) {
                    break; // Exit if the invoice total is fully paid
                }
            }

            if (invoiceEntry.total < 0) {
                return res.status(400).json({ error: "Payment exceeds the invoice total" });
            }
        }

        if (remainingAmount > 0) {
            return res.status(400).json({ error: "Payment exceeds total due amount for all invoices" });
        }

        // Create the new payment object
        const newPayment = {
            type,
            name,
            invoice_number,
            invoise,
            payment_type,
            total,
            amount_received,
            amount,
            transaction,
            note,
            date
        };

        // Add the payment entry
        admin.payment.push(newPayment);

        await admin.save();

        res.status(201).json({ message: "Payment entry added successfully", payment: newPayment, updatedInvoices: admin.sales_entry.concat(admin.purchase_entry) });
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

        const paymentId = req.params.paymentId;
        const payment = admin.payment.id(paymentId);  // Find the payment by ID

        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        // Extract the updated data from the request body
        const { type, name, invoice_number, invoise, payment_type, amount_received, total, amount, transaction, note, date } = req.body;

        // If the invoice number has changed, update the corresponding sales_entry or purchase_entry
        let invoiceEntry;
        if (invoice_number !== payment.invoice_number) {
            // Find invoice in sales_entry or purchase_entry
            for (const inv of invoise) {
                if (type === "customer") {
                    invoiceEntry = admin.sales_entry.find(entry => entry.invoice_number === inv.invoice_number);
                } else if (type === "vendor") {
                    invoiceEntry = admin.purchase_entry.find(entry => entry.invoice_number === inv.invoice_number);
                }

                if (invoiceEntry) break;
            }
            
            if (!invoiceEntry) {
                return res.status(404).json({ error: "Invoice not found in sales or purchase entries" });
            }
            // Update the total in the matched invoice entry
            invoiceEntry.total -= (amount_received - payment.amount_received);  // Adjust total based on updated payment
            if (invoiceEntry.total < 0) {
                return res.status(400).json({ error: "Payment exceeds the invoice total" });
            }
        }

        // Update the payment entry with the new values
        payment.type = type || payment.type;
        payment.name = name || payment.name;
        payment.invoice_number = invoice_number || payment.invoice_number;
        payment.invoise = invoise || payment.invoise;
        payment.payment_type = payment_type || payment.payment_type;
        payment.amount_received = amount_received || payment.amount_received;
        payment.total = total || payment.total;
        payment.amount = amount || payment.amount;
        payment.transaction = transaction || payment.transaction;
        payment.note = note || payment.note;
        payment.date = date || payment.date;

        // Save the updated payment
        await admin.save();

        res.status(200).json({ message: "Payment entry updated successfully", payment });
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