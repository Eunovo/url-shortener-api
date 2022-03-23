import mongoose from "mongoose";

const schema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    alias: { type: String, required: true, unique: true }
});

export const Alias = mongoose.model('Alias', schema);
