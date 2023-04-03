import IPerson from "person/person.interface";

export default interface IBooking {
    _id: number;
    roomNumber: number;
    arrivalDayNumber: number;
    leaveDayNumber: number;
    guestNumber: number;
    hadBreakfast: boolean;
    nameId: number;
    person: IPerson["_id"]; // update the type of person to match the schema reference
}
