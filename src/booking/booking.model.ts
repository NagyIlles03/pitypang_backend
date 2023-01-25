import { Schema, model } from "mongoose";
import IBooking from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
    {
        _id: Number,
        roomNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 27,
        },
        arrivalDayNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 365,
        },
        leaveDayNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 365,
        },
        guestNumber: {
            type: Number,
            required: true,
        },
        hadBreakfast: {
            type: Boolean,
            required: true,
        },
        nameId: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { versionKey: false },
);

const bookingModel = model<IBooking>("Booking", bookingSchema);

export default bookingModel;
