import mongoose from "mongoose";
import { Alias } from "../models/Alias";

const schema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    alias: { type: String, required: true, unique: true }
});

export const AliasModel = mongoose.model<Alias>('Alias', schema);
