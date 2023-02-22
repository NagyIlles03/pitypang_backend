import { NextFunction, Request, Response, Router } from "express";

import IController from "../interfaces/controller.interface";
import HttpException from "../exceptions/HttpException";
import IdNotValidException from "../exceptions/IdNotValidException";
import Ibooking from "./booking.interface";
import bookingNotFoundException from "../exceptions/bookingNotFoundException";
import IRequestWithUser from "../interfaces/requestWithUser.interface";
import { Types } from "mongoose";
import authMiddleware from "../middleware/auth.middleware";
import bookingModel from "./booking.model";

export default class BookingController implements IController {
    public path = "/bookings";
    public router = Router();
    private bookingM = bookingModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllBookings);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getBookingById);
        this.router.get(`${this.path}/:offset/:limit/:order/:sort/:keyword?`, authMiddleware, this.getPaginatedBookings);
        this.router.patch(`${this.path}/:id`, [authMiddleware], this.modifyBooking);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteBookings);
        this.router.post(this.path, [authMiddleware], this.createBooking);
    }

    private getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const count = await this.bookingM.countDocuments();
            const bookings = await this.bookingM.find();
            res.send({ count: count, bookings: bookings });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getPaginatedBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const offset = parseInt(req.params.offset);
            const limit = parseInt(req.params.limit);
            const order = req.params.order;
            const sort = parseInt(req.params.sort); // desc: -1  asc: 1
            let bookings = [];
            let count = 0;
            if (req.params.keyword) {
                const myRegex = new RegExp(req.params.keyword, "i"); // i for case insensitive
                count = await this.bookingM.find({ $or: [{ bookingName: myRegex }, { description: myRegex }] }).count();
                bookings = await this.bookingM
                    .find({ $or: [{ bookingName: myRegex }, { description: myRegex }] })
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            } else {
                count = await this.bookingM.countDocuments();
                bookings = await this.bookingM
                    .find({})
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            }
            res.send({ count: count, bookings: bookings });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getBookingById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const booking = await this.bookingM.findById(id).populate("author", "-password");
                if (booking) {
                    res.send(booking);
                } else {
                    next(new bookingNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private modifyBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const bookingData: Ibooking = req.body;
                const booking = await this.bookingM.findByIdAndUpdate(id, bookingData, { new: true });
                if (booking) {
                    res.send(booking);
                } else {
                    next(new bookingNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private createBooking = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
        try {
            const bookingData: Ibooking = req.body;
            const createdbooking = new this.bookingM({
                ...bookingData,
                author: req.user._id,
            });
            const savedbooking = await createdbooking.save();
            await savedbooking.populate("author", "-password");
            res.send(savedbooking);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private deleteBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const successResponse = await this.bookingM.findByIdAndDelete(id);
                if (successResponse) {
                    res.sendStatus(200);
                } else {
                    next(new bookingNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
