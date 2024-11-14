const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true 
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        referenceCode: {
            type: String,
            unique: true,
            required: true
        },
        amount: {
            currency: { type: String, default: 'Naira', required: true },
            value: { type: Number, default: 0, required: true }
        },
        fees: {
            currency: { type: String, default: 'Naira' },
            value: { type: Number, default: 0 }
        },
        paymentMethod: {
            type: String,
            enum: ['external', 'internal']
        },
        transactionType: {
            type: String,
            enum: ['deposit', 'withdrawal', 'transfer'],
            required: true
        },
        transferType: {
            type: String
        },
        status: {
            type: String,
            enum: ['processing', 'success', 'failed'],
            default: 'processing',
            required: true
        },
        lastUpdate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
