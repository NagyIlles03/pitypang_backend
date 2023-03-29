import { NextFunction, Request, Response, Router } from "express";

import IController from "../interfaces/controller.interface";
import HttpException from "../exceptions/HttpException";
import IdNotValidException from "../exceptions/IdNotValidException";
import Iperson from "./person.interface";
import personNotFoundException from "../exceptions/personNotFoundException";
import IRequestWithUser from "../interfaces/requestWithUser.interface";
import { Types } from "mongoose";
import authMiddleware from "../middleware/auth.middleware";
import personModel from "./person.model";

export default class PersonController implements IController {
    public path = "/api/people";
    public router = Router();
    private personM = personModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllPeople);
        this.router.get(`${this.path}/:id`, this.getPersonById);
        this.router.get(`${this.path}/:offset/:limit/:order/:sort/:keyword?`, this.getPaginatedPeople);
        this.router.patch(`${this.path}/:id`, [authMiddleware], this.modifyPerson);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePeople);
        this.router.post(this.path, [authMiddleware], this.createPerson);
    }

    private getAllPeople = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const count = await this.personM.countDocuments();
            const people = await this.personM.find();
            res.send({ count: count, people: people });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getPaginatedPeople = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const offset = parseInt(req.params.offset);
            const limit = parseInt(req.params.limit);
            const order = req.params.order;
            const sort = parseInt(req.params.sort); // desc: -1  asc: 1
            let people = [];
            let count = 0;
            if (req.params.keyword) {
                const myRegex = new RegExp(req.params.keyword, "i"); // i for case insensitive
                count = await this.personM.find({ $or: [{ personName: myRegex }, { description: myRegex }] }).count();
                people = await this.personM
                    .find({ $or: [{ personName: myRegex }, { description: myRegex }] })
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            } else {
                count = await this.personM.countDocuments();
                people = await this.personM
                    .find({})
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            }
            res.send({ count: count, people: people });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getPersonById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!isNaN(Number(id))) {
                const person = await this.personM.findById(id);
                if (person) {
                    res.send(person);
                } else {
                    next(new personNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private modifyPerson = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!isNaN(Number(id))) {
                const personData: Iperson = req.body;
                const person = await this.personM.findByIdAndUpdate(id, personData, { new: true });
                if (person) {
                    res.send(person);
                } else {
                    next(new personNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private createPerson = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
        try {
            const personData: Iperson = req.body;
            const createdperson = new this.personM({
                ...personData,
                author: req.user._id,
            });
            const savedperson = await createdperson.save();
            res.send(savedperson);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private deletePeople = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (!isNaN(Number(id))) {
                const successResponse = await this.personM.findByIdAndDelete(id);
                if (successResponse) {
                    res.sendStatus(200);
                } else {
                    next(new personNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
