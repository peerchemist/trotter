
import { Logger } from '@nestjs/common';
const fs = require('fs');

export class TrotterLogger extends Logger {
    gettime() {
        // add your tailored logic here
        var d = new Date(); // for now
        const hour = d.getHours(); // => 9
        const min = d.getMinutes(); // =>  30
        const sec = d.getSeconds(); // => 51
        const day = d.getDate()
        const month = d.getMonth()
        const year = d.getFullYear()
        const time = `${hour}:${min}:${sec} ${day}/${month + 1}/${year}`
        return time
    }

    error(message: string, trace: string) {
        // add your tailored logic here
        const time = this.gettime()
        const msg = `${time} \nMessage: \n${message} \nTrace: \n${trace} \n`;
        
        fs.writeFileSync(__dirname+'/../../errors.log', msg, { flag: 'a' });
        super.error(message, trace);
    }
}