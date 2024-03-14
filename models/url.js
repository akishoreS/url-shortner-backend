// const mongoose = require('mongoose');

// const urlSchema = new mongoose.Schema({
//     shortId: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     redirectURL: {
//         type: String,
//         required: true,
//     },
//     visitHistory: [{ timestamp: { type: Number } }],
//     utmParams: {
//         source: String,
//         medium: String,
//         campaign: String,
//         presets: [String],
//         forceLowercase: Boolean,
//         bitlySupport: Boolean,
//         autoGenerateUrl: Boolean,
//         lastUtmSet: { type: Date, default: null },
//         dockedVersion: Boolean
//     }
// }, { timestamps: true });

// const URL = mongoose.model("url", urlSchema);

// module.exports = URL;

const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    redirectURL: {
        type: String,
        required: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
}, { timestamps: true });

const URL = mongoose.model("url", urlSchema);

module.exports = URL;
