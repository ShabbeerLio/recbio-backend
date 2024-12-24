const mongoose = require('mongoose');
const { Schema } = mongoose;


const PaymentItemSchema = new mongoose.Schema({
    date: {
        type: String,
    },
    invoice_number: {
        type: Number,
    },
    invoice_amount: {
        type: Number,
    },
    amount_due: {
        type: Number,
    },
    payment: {
        type: String,
    },
})

const PaymentSchema = new mongoose.Schema({
    type: {
        type: String,
    },
    name: {
        type: Number,
    },
    invoice_number: {
        type: Number,
    },
    note: {
        type: String,
    },
    amount: {
        type: String,
    },
    item:[PaymentItemSchema],
})

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    unit: {
        type: Number,
    },
    tax: {
        type: Boolean,
    },
    hsn: {
        type: Number,
    },
    selling_price: {
        type: Number,
    },
    cost_price: {
        type: Number,
    },
    description:{
        type: String,
    },
    mfr_name:{
        type: String,
    },
    gst:{
        type: String,
    }
})

const PurchaseItemSchema = new mongoose.Schema({
    item: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    tax: {
        type: Number,
    },
    mfg: {
        type: Number,
    },
    exp: {
        type: Number
    },
    amount: {
        type: Number,
    },
})

const SalesSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    bill: {
        type: String,
    },
    order_number: {
        type: Number,
    },
    invoice_number: {
        type: Number,
    },
    salesperson: {
        type: String,
    },
    bill_date: {
        type: Number,
    },
    due_date: {
        type: Number
    },
    payment_type: {
        type: String,
    },
    item: [PurchaseItemSchema],
    note:{
        type: String,
    },
    terms:{
        type: String,
    }
})

const PurchaseSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    bill: {
        type: String,
    },
    order_number: {
        type: Number,
    },
    bill_date: {
        type: Number,
    },
    due_date: {
        type: Number
    },
    payment_type: {
        type: String,
    },
    item: [PurchaseItemSchema],
    note:{
        type: String,
    },
    recipt:{
        type: String,
    }
})

const ShippingSchema = new mongoose.Schema({
    attention: {
        type: String,
    },
    address1: {
        type: String,
    },
    address2: {
        type: String,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    phone: {
        type: Number,
    },
    FAX: {
        type: Number,
    },
})

const BillingSchema = new mongoose.Schema({
    attention: {
        type: String,
    },
    address1: {
        type: String,
    },
    address2: {
        type: String,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    phone: {
        type: Number,
    },
    FAX: {
        type: Number,
    },
})


const RemarkSchema = new mongoose.Schema({
    remark: {
        type: String,
    },
})

const AddressSchema = new mongoose.Schema({
    billing: [BillingSchema],
    shipping: [ShippingSchema]
});

const OtherSchema = new mongoose.Schema({
    place: {
        type: String,
    },
    pan: {
        type: String,
    },
    GST: {
        type: String,
    },
});

const CustomerSchema = new mongoose.Schema({
    type: {
        type: String,
    },
    name: {
        type: String,
    },
    displayName: {
        type: String,
    },
    companyName: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: Number
    },
    mobile: {
        type: Number,
    },
    other: [OtherSchema],
    address: [AddressSchema],
    remark: [RemarkSchema,]
});

const AdminSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
    },
    customer: [CustomerSchema],
    vandor: [CustomerSchema],
    purchase_entry: [PurchaseSchema],
    sales_entry: [SalesSchema],
    items:[ItemSchema],
    payment:[PaymentSchema],
})

module.exports = mongoose.model('admin', AdminSchema);