"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrotterLogger = void 0;
const common_1 = require("@nestjs/common");
const fs = require('fs');
class TrotterLogger extends common_1.Logger {
    gettime() {
        var d = new Date();
        const hour = d.getHours();
        const min = d.getMinutes();
        const sec = d.getSeconds();
        const day = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear();
        const time = `${hour}:${min}:${sec} ${day}/${month + 1}/${year}`;
        return time;
    }
    error(message, trace) {
        const time = this.gettime();
        const msg = `${time} \nMessage: \n${message} \nTrace: \n${trace} \n`;
        fs.writeFileSync(__dirname + '/../../errors.log', msg, { flag: 'a' });
        super.error(message, trace);
    }
}
exports.TrotterLogger = TrotterLogger;
//# sourceMappingURL=logger.js.map