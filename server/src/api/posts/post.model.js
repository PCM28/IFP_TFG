const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema (
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        image: { type: String, default: null }
        // createdAt: { type: Date, default: Date.now },
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('Post', postSchema);