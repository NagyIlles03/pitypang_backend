"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const booking_dto_1 = tslib_1.__importDefault(require("./booking.dto"));
const HttpException_1 = tslib_1.__importDefault(require("../exceptions/HttpException"));
const IdNotValidException_1 = tslib_1.__importDefault(require("../exceptions/IdNotValidException"));
const bookingNotFoundException_1 = tslib_1.__importDefault(require("../exceptions/bookingNotFoundException"));
const mongoose_1 = require("mongoose");
const auth_middleware_1 = tslib_1.__importDefault(require("../middleware/auth.middleware"));
const booking_model_1 = tslib_1.__importDefault(require("./booking.model"));
const validation_middleware_1 = tslib_1.__importDefault(require("../middleware/validation.middleware"));
class bookingController {
    path = "/bookings";
    router = (0, express_1.Router)();
    bookingM = booking_model_1.default;
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, auth_middleware_1.default, this.getAllbookings);
        this.router.get(`${this.path}/:id`, auth_middleware_1.default, this.getbookingById);
        this.router.get(`${this.path}/:offset/:limit/:order/:sort/:keyword?`, auth_middleware_1.default, this.getPaginatedbookings);
        this.router.patch(`${this.path}/:id`, [auth_middleware_1.default, (0, validation_middleware_1.default)(booking_dto_1.default, true)], this.modifybooking);
        this.router.delete(`${this.path}/:id`, auth_middleware_1.default, this.deletebookings);
        this.router.post(this.path, [auth_middleware_1.default, (0, validation_middleware_1.default)(booking_dto_1.default)], this.createbooking);
    }
    getAllbookings = async (req, res, next) => {
        try {
            const count = await this.bookingM.countDocuments();
            const bookings = await this.bookingM.find();
            res.send({ count: count, bookings: bookings });
        } catch (error) {
            next(new HttpException_1.default(400, error.message));
        }
    };
    getPaginatedbookings = async (req, res, next) => {
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
            next(new HttpException_1.default(400, error.message));
        }
    };
    getbookingById = async (req, res, next) => {
        try {
            const id = req.params.id;
            if (mongoose_1.Types.ObjectId.isValid(id)) {
                const booking = await this.bookingM.findById(id).populate("author", "-password");
                if (booking) {
                    res.send(booking);
                } else {
                    next(new bookingNotFoundException_1.default(id));
                }
            } else {
                next(new IdNotValidException_1.default(id));
            }
        } catch (error) {
            next(new HttpException_1.default(400, error.message));
        }
    };
    modifybooking = async (req, res, next) => {
        try {
            const id = req.params.id;
            if (mongoose_1.Types.ObjectId.isValid(id)) {
                const bookingData = req.body;
                const booking = await this.bookingM.findByIdAndUpdate(id, bookingData, { new: true });
                if (booking) {
                    res.send(booking);
                } else {
                    next(new bookingNotFoundException_1.default(id));
                }
            } else {
                next(new IdNotValidException_1.default(id));
            }
        } catch (error) {
            next(new HttpException_1.default(400, error.message));
        }
    };
    createbooking = async (req, res, next) => {
        try {
            const bookingData = req.body;
            const createdbooking = new this.bookingM({
                ...bookingData,
                author: req.user._id,
            });
            const savedbooking = await createdbooking.save();
            await savedbooking.populate("author", "-password");
            res.send(savedbooking);
        } catch (error) {
            next(new HttpException_1.default(400, error.message));
        }
    };
    deletebookings = async (req, res, next) => {
        try {
            const id = req.params.id;
            if (mongoose_1.Types.ObjectId.isValid(id)) {
                const successResponse = await this.bookingM.findByIdAndDelete(id);
                if (successResponse) {
                    res.sendStatus(200);
                } else {
                    next(new bookingNotFoundException_1.default(id));
                }
            } else {
                next(new IdNotValidException_1.default(id));
            }
        } catch (error) {
            next(new HttpException_1.default(400, error.message));
        }
    };
}
exports.default = bookingController;
//# sourceMappingURL=booking.controller.js.map
