import { Schema, model } from "mongoose";
import IPrice from "./price.interface";

const priceSchema = new Schema<IPrice>(
    {
        month: String,
        days: Number,
        startDay: Number,
    },
    { versionKey: false },
);

const priceModel = model<IPrice>("Price", priceSchema);

export default priceModel;
