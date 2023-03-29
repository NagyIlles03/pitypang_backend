import HttpException from "./HttpException";

export default class BookingNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Booking with id ${id} not found`);
    }
}
