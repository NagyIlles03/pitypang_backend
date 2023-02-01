import { Schema, model } from "mongoose";
import IPerson from "./person.interface";

const personSchema = new Schema<IPerson>(
    {
        _id: Number,
        name: {
            type: String,
            maxLength: 25,
        },
    },
    { versionKey: false },
);

const personModel = model<IPerson>("Person", personSchema);

export default personModel;
