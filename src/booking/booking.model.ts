import { Schema, model } from "mongoose";
import IBooking from "./booking.interface";
import IPerson from "person/person.interface";

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
            type: Number,
            required: true,
        },
        person: { // add the reference to the person schema
            type: Number,
            ref: "Person",
        },
    },
    { versionKey: false },
);

const bookingModel = model<IBooking>("Booking", bookingSchema);

export default bookingModel;
