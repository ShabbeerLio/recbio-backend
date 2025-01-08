const mongoose = require('mongoose');
const { Schema } = mongoose;


const organisationSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    gst: {
        type: String,
    },
    location: {
        type: String,
    },
    state: {
        type: String,
    },
    street1: {
        type: String,
    },
    street2: {
        type: String,
    },
    city: {
        type: String,
    },
    zip_code: {
        type: String,
    },
})

const PaymentItemSchema = new mongoose.Schema({
    date: {
        type: String,
    },
    invoice_number: {
        type: Number,
    },
    invoice_amount: {
        type: String,
    },
    paid: {
        type: String,
    },
    due: {
        type: String,
    },
})

const PaymentSchema = new mongoose.Schema({
    type: {
        type: String,
    },
    name: {
        type: String,
    },
    invoice_number: {
        type: String,
    },
    invoise: [PaymentItemSchema],
    payment_type: {
        type: String,
    },
    amount_received: {
        type: String,
    },
    amount: {
        type: String,
    },
    note: {
        type: String,
    },
})

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    unit: {
        type: String,
    },
    tax: {
        type: Boolean,
    },
    selling_price: {
        type: Number,
    },
    cost_price: {
        type: Number,
    },
    description: {
        type: String,
    },
    mfr_name: {
        type: String,
    },
    gst: {
        type: String,
    }
})

const PurchaseItemSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    rate: {
        type: Number,
    },
    tax: {
        type: Number,
    },
    mfg: {
        type: String,
    },
    exp: {
        type: String,
    },
    price: {
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
        type: String,
    },
    salesperson: {
        type: String,
    },
    bill_date: {
        type: String,
    },
    due_date: {
        type: String
    },
    payment_type: {
        type: String,
    },
    item: [PurchaseItemSchema],
    discount: {
        type: Number,
    },
    total: {
        type: Number,
    },
    note: {
        type: String,
    },
    terms: {
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
    invoice_number: {
        type: String,
    },
    bill_date: {
        type: String,
    },
    due_date: {
        type: String
    },
    payment_type: {
        type: String,
    },
    hsn: {
        type: String,
    },
    batch: {
        type: String,
    },
    item: [PurchaseItemSchema],
    discount: {
        type: Number,
    },
    total: {
        type: Number,
    },
    note: {
        type: String,
    },
    recipt: {
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
    fax: {
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
    fax: {
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
    gst: {
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
    items: [ItemSchema],
    payment: [PaymentSchema],
    organisation:[organisationSchema],
})

module.exports = mongoose.model('admin', AdminSchema);