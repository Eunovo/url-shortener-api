import mongoose from "mongoose";

export function setup(uri: string) {
    mongoose.connect(uri, () => {
        console.log('DB connected');
    });
}
