"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = tslib_1.__importDefault(require("../../dist/exceptions/HttpException"));
class PostNotFoundException extends HttpException_1.default {
    constructor(id) {
        super(404, `Post with id ${id} not found`);
    }
}
exports.default = PostNotFoundException;
//# sourceMappingURL=PostNotFoundException.js.map