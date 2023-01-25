export default interface IBooking {
    _id: number;
    roomNumber: number;
    arrivalDayNumber: number;
    leaveDayNumber: number;
    guestNumber: number;
    hadBreakfast: boolean;
    nameId: string;
}
