import HttpException from "./HttpException";

export default class PersonNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Person with id ${id} not found`);
    }
}
