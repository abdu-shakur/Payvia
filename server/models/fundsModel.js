const mongoose = require('mongoose')

const fundsShcema = mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
             ref: 'User', 
             required: true 
        },
        balance: {
            currency: {type: String, default: 'Naira', required: true},
            value: {type: Number, default: 0, required: true}
        },
        lastUpdate: {
            type: Date,
            default: Date.now
        } 

    }
)

module.exports= mongoose.model('Balance', fundsShcema)